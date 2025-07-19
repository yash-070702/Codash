const axios = require("axios");
const cheerio = require("cheerio");
const BASE_URL = "https://geeks-for-geeks-api.vercel.app";

exports.getCodeChefDetails = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "CodeChef username is required",
    });
  }

  try {
    const url = `https://www.codechef.com/users/${username}`;
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    const $ = cheerio.load(html);

    // Basic profile details
    const rating = $(".rating-number").first().text().trim();
    const stars = $(".rating-star").first().text().trim();
    const highestRating = $(".rating-header small")
      .first()
      .text()
      .replace("(", "")
      .replace(")", "")
      .trim();

    const institute = $(".user-details-container .user-country-name")
      .first()
      .text()
      .trim();

    // Ranks
    const globalRank = $(".rating-ranks ul li")
      .first()
      .find("strong")
      .text()
      .trim();
    const countryRank = $(".rating-ranks ul li")
      .last()
      .find("strong")
      .text()
      .trim();

    // Total solved
    const totalSolved =
      $("section.problems-solved")
        .text()
        .match(/Total Problems Solved:\s*(\d+)/)?.[1] || "0";

    // Difficulty-wise
    const difficulties = { Easy: 0, Medium: 0, Hard: 0 };
    $("section.problems-solved article").each((_, el) => {
      const text = $(el).find("h5").text().trim();
      const count = $(el).find("p").text().match(/\d+/)?.[0];
      if (text.includes("Easy")) difficulties.Easy = parseInt(count) || 0;
      else if (text.includes("Medium"))
        difficulties.Medium = parseInt(count) || 0;
      else if (text.includes("Hard")) difficulties.Hard = parseInt(count) || 0;
    });

    // Solved problems
    const solvedProblems = [];
    $("section.problems-solved article p a").each((_, el) => {
      const code = $(el).text().trim();
      const href = $(el).attr("href");
      if (code && href) {
        solvedProblems.push({
          code,
          url: `https://www.codechef.com${href}`,
        });
      }
    });

    // Number of contests
    const contestsText = $('h5:contains("Contests")').text();
    const contestCount = contestsText.match(/Contests\s*\((\d+)\)/)?.[1] || "0";

    // 🔥 ENHANCED HEATMAP DATA
    const heatmapResult = await generateCodeChefHeatmap(username);

    return res.status(200).json({
      success: true,
      username,
      profileUrl: url,
      data: {
        rating,
        stars,
        highestRating,
        totalSolved: parseInt(totalSolved),
        totalQuestionsCount: parseInt(totalSolved), // Add total count field
        institute,
        globalRank,
        countryRank,
        contestCount: parseInt(contestCount),
        difficultyWiseSolved: difficulties,
        solvedProblems,
        heatmap: heatmapResult.heatmapData, // ✅ GitHub-style heatmap array
        heatmapStats: heatmapResult.stats, // ✅ comprehensive statistics
        calendar: heatmapResult.calendar, // ✅ calendar object format
      },
    });
  } catch (error) {
    console.error("Error fetching CodeChef data:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch CodeChef data",
      error: error.message,
    });
  }
};

// 🚀 ENHANCED HEATMAP GENERATION FUNCTION
async function generateCodeChefHeatmap(username) {
  const result = {
    heatmapData: [],
    stats: {
      totalSubmissions: 0,
      activeDays: 0,
      maxSubmissionsPerDay: 0,
      currentStreak: 0,
      longestStreak: 0,
      last6MonthsData: true,
      averageSubmissionsPerDay: 0,
      mostActiveMonth: null,
      lastSubmissionDate: null,
    },
    calendar: {},
  };

  const currentYear = new Date().getFullYear();
  let rawHeatmap = {};

  // Method 1: Try multiple third-party APIs
  const apis = [
    `https://codechef-api.vercel.app/handle/${username}`,
    `https://competitive-coding-api.herokuapp.com/api/codechef/${username}`,
    `https://codechef-api.herokuapp.com/${username}`,
    `https://api.codechef.com/users/${username}`, // Official API (if available)
  ];

  for (const apiUrl of apis) {
    try {
      console.log(`Trying API: ${apiUrl}`);
      const apiResponse = await axios.get(apiUrl, {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (apiResponse.data && apiResponse.data.success !== false) {
        const apiData = apiResponse.data;

        // Extract heatmap data from different API response formats
        if (apiData.heatMap) {
          rawHeatmap = apiData.heatMap;
          break;
        } else if (apiData.submissionCalendar) {
          rawHeatmap = apiData.submissionCalendar;
          break;
        } else if (apiData.calendar) {
          rawHeatmap = apiData.calendar;
          break;
        } else if (apiData.submissions) {
          rawHeatmap = processSubmissionsToHeatmap(apiData.submissions);
          break;
        } else if (apiData.data && apiData.data.heatMap) {
          rawHeatmap = apiData.data.heatMap;
          break;
        }
      }
    } catch (apiError) {
      console.warn(`API ${apiUrl} failed:`, apiError.message);
      continue;
    }
  }

  // Method 2: Fallback to web scraping
  if (Object.keys(rawHeatmap).length === 0) {
    console.log("APIs failed, trying web scraping...");
    rawHeatmap = await scrapeCodeChefSubmissions(username);
  }

  // Method 3: Generate structure with available data or empty
  result.heatmapData = generateHeatmapStructure(rawHeatmap, currentYear);
  result.calendar = rawHeatmap;
  result.stats = calculateHeatmapStats(rawHeatmap);

  return result;
}

// Process submissions array to heatmap format
function processSubmissionsToHeatmap(submissions) {
  const heatmap = {};

  if (Array.isArray(submissions)) {
    submissions.forEach((submission) => {
      let date = null;

      // Handle different date formats
      if (submission.date) {
        date = submission.date.split("T")[0];
      } else if (submission.submissionDate) {
        date = submission.submissionDate.split("T")[0];
      } else if (submission.time) {
        date = new Date(submission.time).toISOString().split("T")[0];
      }

      if (date) {
        heatmap[date] = (heatmap[date] || 0) + 1;
      }
    });
  }

  return heatmap;
}

// Enhanced web scraping for CodeChef submissions
async function scrapeCodeChefSubmissions(username) {
  const heatmap = {};

  try {
    // Try to scrape from multiple CodeChef pages
    const pages = [
      `https://www.codechef.com/users/${username}/submissions`,
      `https://www.codechef.com/users/${username}`,
      `https://www.codechef.com/ide/submissions/${username}`,
    ];

    for (const pageUrl of pages) {
      try {
        const { data: html } = await axios.get(pageUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          timeout: 10000,
        });

        const $ = cheerio.load(html);

        // Look for submission data in various formats

        // Method 1: Check for submission table
        $("table tr").each((_, row) => {
          const $row = $(row);
          const timeCell = $row.find("td").first();
          const timeText = timeCell.text().trim();

          // Parse different date formats
          const dateFormats = [
            /(\d{4}-\d{2}-\d{2})/,
            /(\d{2}\/\d{2}\/\d{4})/,
            /(\d{2}-\d{2}-\d{4})/,
            /(\d{1,2}\s+\w+\s+\d{4})/,
          ];

          for (const format of dateFormats) {
            const match = timeText.match(format);
            if (match) {
              const date = standardizeDate(match[1]);
              if (date) {
                heatmap[date] = (heatmap[date] || 0) + 1;
              }
              break;
            }
          }
        });

        // Method 2: Check for JavaScript data
        $("script").each((_, script) => {
          const scriptContent = $(script).html();
          if (
            scriptContent &&
            (scriptContent.includes("submission") ||
              scriptContent.includes("calendar"))
          ) {
            // Extract dates from JavaScript
            const dateRegex = /["'](\d{4}-\d{2}-\d{2})["']/g;
            let match;
            while ((match = dateRegex.exec(scriptContent)) !== null) {
              const date = match[1];
              heatmap[date] = (heatmap[date] || 0) + 1;
            }
          }
        });

        // Method 3: Look for specific CodeChef calendar data
        const calendarScript = $('script:contains("calendar")').html();
        if (calendarScript) {
          try {
            const calendarData = calendarScript.match(
              /calendar["\']?\s*:\s*({[^}]+})/
            );
            if (calendarData) {
              const parsed = JSON.parse(calendarData[1]);
              Object.assign(heatmap, parsed);
            }
          } catch (e) {
            console.warn("Failed to parse calendar data:", e.message);
          }
        }

        if (Object.keys(heatmap).length > 0) {
          break; // Stop if we found data
        }
      } catch (pageError) {
        console.warn(`Failed to scrape ${pageUrl}:`, pageError.message);
        continue;
      }
    }
  } catch (error) {
    console.warn("Web scraping failed:", error.message);
  }

  return heatmap;
}

// Standardize different date formats to YYYY-MM-DD
function standardizeDate(dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split("T")[0];
  } catch (error) {
    return null;
  }
}

// Generate complete heatmap structure for the year
function generateHeatmapStructure(rawHeatmap, year) {
  const heatmapData = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateString = date.toISOString().split("T")[0];
    const count = rawHeatmap[dateString] || 0;

    // Calculate intensity (0-4 scale)
    let intensity = 0;
    if (count > 0) {
      if (count <= 1) intensity = 1;
      else if (count <= 3) intensity = 2;
      else if (count <= 6) intensity = 3;
      else intensity = 4;
    }

    heatmapData.push({
      date: dateString,
      count: count,
      intensity: intensity,
      dayOfWeek: date.getDay(),
      week: Math.ceil((date - startDate) / (7 * 24 * 60 * 60 * 1000)),
      month: date.getMonth() + 1,
      day: date.getDate(),
      year: year,
    });
  }

  return heatmapData;
}

// Calculate comprehensive heatmap statistics
function calculateHeatmapStats(rawHeatmap) {
  const dates = Object.keys(rawHeatmap).sort();
  const counts = Object.values(rawHeatmap);

  if (dates.length === 0) {
    return {
      totalSubmissions: 0,
      activeDays: 0,
      maxSubmissionsPerDay: 0,
      currentStreak: 0,
      longestStreak: 0,
      last6MonthsData: true,
      averageSubmissionsPerDay: 0,
      mostActiveMonth: null,
      lastSubmissionDate: null,
    };
  }

  const totalSubmissions = counts.reduce((sum, count) => sum + count, 0);
  const activeDays = dates.length;
  const maxSubmissionsPerDay = Math.max(...counts);
  const averageSubmissionsPerDay = totalSubmissions / activeDays;
  const lastSubmissionDate = dates[dates.length - 1];

  // Calculate streaks
  const streaks = calculateStreaks(rawHeatmap);

  // Find most active month
  const monthCounts = {};
  dates.forEach((date) => {
    const month = date.substring(0, 7); // YYYY-MM
    monthCounts[month] = (monthCounts[month] || 0) + rawHeatmap[date];
  });

  const mostActiveMonth = Object.keys(monthCounts).reduce(
    (a, b) => (monthCounts[a] > monthCounts[b] ? a : b),
    null
  );

  return {
    totalSubmissions,
    activeDays,
    maxSubmissionsPerDay,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
    last6MonthsData: true,
    averageSubmissionsPerDay: Math.round(averageSubmissionsPerDay * 100) / 100,
    mostActiveMonth,
    lastSubmissionDate,
  };
}

// Enhanced streak calculation
function calculateStreaks(heatmap) {
  const dates = Object.keys(heatmap).sort();
  if (dates.length === 0) return { current: 0, longest: 0 };

  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 1;

  // Calculate longest streak
  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const previousDate = new Date(dates[i - 1]);
    const daysDiff = Math.floor(
      (currentDate - previousDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak (from today backwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = dates.length - 1; i >= 0; i--) {
    const date = new Date(dates[i]);
    const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));

    if (daysDiff === currentStreak) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

// Optional: Separate heatmap endpoint
exports.getCodeChefHeatmap = async (req, res) => {
  const { username } = req.params;
  const { year } = req.query;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "CodeChef username is required",
    });
  }

  try {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const heatmapResult = await generateCodeChefHeatmap(username);

    return res.status(200).json({
      success: true,
      message: "CodeChef heatmap data fetched successfully",
      data: {
        username,
        year: targetYear,
        heatmap: heatmapResult.heatmapData,
        calendar: heatmapResult.calendar,
        stats: heatmapResult.stats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch CodeChef heatmap data",
      error: error.message,
    });
  }
};






exports.getLeetCodeDetails = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "LeetCode username is required",
    });
  }

  try {
    const graphqlUrl = "https://leetcode.com/graphql";

    const leetCodeStats = await fetchLeetCodeQuestionCounts();

    // Step 1: Fetch profile and solved stats
    const profileQuery = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              realName
              userAvatar
              school
              countryName
              ranking
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username },
    };

    const profileResponse = await axios.post(graphqlUrl, profileQuery, {
      headers: { "Content-Type": "application/json" },
    });

    const user = profileResponse.data?.data?.matchedUser;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "LeetCode user not found",
      });
    }

    // Step 2: Map difficulty-wise solved
    const submissions = {};
    user.submitStatsGlobal.acSubmissionNum.forEach(({ difficulty, count }) => {
      submissions[difficulty] = count;
    });

    const profileUrl = `https://leetcode.com/${username}/`;
    let recentSolved = [];

    // Step 3: Scrape recent submissions from __NEXT_DATA__
    try {
      const { data: html } = await axios.get(profileUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      const $ = cheerio.load(html);
      const nextDataScript = $("#__NEXT_DATA__").html();

      if (nextDataScript) {
        const nextData = JSON.parse(nextDataScript);
        const recentRaw =
          nextData?.props?.pageProps?.profileData?.recentSubmissionList;

        if (Array.isArray(recentRaw)) {
          recentSolved = recentRaw
            .filter((item) => item.statusDisplay === "Accepted")
            .map((item) => ({
              title: item.title,
              url: `https://leetcode.com/problems/${item.titleSlug}/`,
              lang: item.lang,
              timestamp: new Date(item.timestamp * 1000).toISOString(),
            }))
            .slice(0, 10);
        }
      }
    } catch (err) {
      console.warn("Could not fetch recent submissions:", err.message);
    }

    // Step 4: Fetch comprehensive submission calendar for heatmap
    let heatmap = {
      activeYears: [],
      submissionsByDate: [],
      statistics: {
        totalSubmissions: 0,
        totalActiveDays: 0,
        currentStreak: 0,
        longestStreak: 0,
        maxSubmissionsInDay: 0,
        averageSubmissionsPerDay: 0,
        streakRanges: [],
        monthlyStats: {},
        yearlyStats: {},
      },
    };

    try {
      // First get the active years to know what data to fetch
      const activeYearsQuery = {
        query: `
          query userCalendar($username: String!) {
            matchedUser(username: $username) {
              userCalendar {
                activeYears
                submissionCalendar
              }
            }
          }
        `,
        variables: { username },
      };

      const activeYearsResponse = await axios.post(graphqlUrl, activeYearsQuery, {
        headers: { "Content-Type": "application/json" },
      });

      const calendarData = activeYearsResponse.data?.data?.matchedUser?.userCalendar;

      if (calendarData) {
        let allSubmissions = [];
        let activeYears = calendarData.activeYears || [];

        // If activeYears is empty, try to determine from current calendar data
        if (activeYears.length === 0 && calendarData.submissionCalendar) {
          const rawCalendar = JSON.parse(calendarData.submissionCalendar);
          const timestamps = Object.keys(rawCalendar).map(ts => parseInt(ts));
          if (timestamps.length > 0) {
            const years = timestamps.map(ts => new Date(ts * 1000).getFullYear());
            activeYears = [...new Set(years)].sort();
          }
        }

        // Get comprehensive calendar data
        if (calendarData.submissionCalendar) {
          const rawCalendar = JSON.parse(calendarData.submissionCalendar);
          const submissionsByDate = Object.entries(rawCalendar).map(
            ([timestamp, count]) => ({
              date: new Date(Number(timestamp) * 1000)
                .toISOString()
                .split("T")[0],
              count: Number(count),
            })
          );
          allSubmissions = submissionsByDate;
        }

        // Try to get additional historical data by fetching year-specific data
        if (activeYears.length > 0) {
          const historicalData = await fetchHistoricalSubmissions(graphqlUrl, username, activeYears);
          if (historicalData.length > 0) {
            // Merge with existing data, preferring newer data for overlaps
            const existingDates = new Set(allSubmissions.map(s => s.date));
            const newData = historicalData.filter(h => !existingDates.has(h.date));
            allSubmissions = [...allSubmissions, ...newData];
          }
        }

        // If we still don't have enough historical data, try alternative approaches
        if (allSubmissions.length > 0) {
          const earliestDate = new Date(Math.min(...allSubmissions.map(s => new Date(s.date))));
          const latestDate = new Date(Math.max(...allSubmissions.map(s => new Date(s.date))));
          
          // Fill in missing dates with 0 submissions to have complete data
          const filledSubmissions = fillMissingDates(allSubmissions, earliestDate, latestDate);
          
          // Update active years based on actual data
          const dataYears = [...new Set(filledSubmissions.map(s => new Date(s.date).getFullYear()))].sort();
          if (dataYears.length > activeYears.length) {
            activeYears = dataYears;
          }

          // Calculate enhanced statistics
          const stats = calculateHeatmapStatistics(filledSubmissions);

          heatmap = {
            activeYears,
            submissionsByDate: filledSubmissions,
            statistics: stats,
          };
        }
      }
    } catch (calendarErr) {
      console.warn("Could not fetch calendar data:", calendarErr.message);
    }

    // Step 5: Fetch latest questions
    let latestQuestions = [];
    try {
      const questionsQuery = {
        query: `
          query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
            problemsetQuestionList: questionList(
              categorySlug: $categorySlug
              limit: $limit
              skip: $skip
              filters: $filters
            ) {
              total: totalNum
              questions: data {
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                status
                title
                titleSlug
                topicTags {
                  name
                  id
                  slug
                }
                hasSolution
                hasVideoSolution
              }
            }
          }
        `,
        variables: {
          categorySlug: "",
          skip: 0,
          limit: 50,
          filters: {},
        },
      };

      const questionsResponse = await axios.post(graphqlUrl, questionsQuery, {
        headers: { "Content-Type": "application/json" },
      });

      const questionsData = questionsResponse.data?.data?.problemsetQuestionList;

      if (questionsData && questionsData.questions) {
        latestQuestions = questionsData.questions
          .filter((q) => !q.paidOnly)
          .slice(0, 20)
          .map((question) => ({
            id: question.frontendQuestionId,
            title: question.title,
            titleSlug: question.titleSlug,
            difficulty: question.difficulty,
            url: `https://leetcode.com/problems/${question.titleSlug}/`,
            acceptanceRate: parseFloat(question.acRate).toFixed(1),
            status: question.status,
            isSolved: question.status === "ac",
            topicTags: question.topicTags.map((tag) => ({
              name: tag.name,
              slug: tag.slug,
            })),
            hasSolution: question.hasSolution,
            hasVideoSolution: question.hasVideoSolution,
            isPremium: question.paidOnly,
          }));
      }
    } catch (questionsErr) {
      console.warn("Could not fetch latest questions:", questionsErr.message);
    }

    // Step 6: Fetch trending questions
    let trendingQuestions = [];
    try {
      const trendingQuery = {
        query: `
          query dailyCodingQuestionRecords($year: Int!, $month: Int!) {
            dailyCodingChallengeV2(year: $year, month: $month) {
              challenges {
                date
                userStatus
                link
                question {
                  questionFrontendId
                  title
                  titleSlug
                  difficulty
                  acRate
                  topicTags {
                    name
                    slug
                  }
                  isPaidOnly
                }
              }
            }
          }
        `,
        variables: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      };

      const trendingResponse = await axios.post(graphqlUrl, trendingQuery, {
        headers: { "Content-Type": "application/json" },
      });

      const trendingData = trendingResponse.data?.data?.dailyCodingChallengeV2;

      if (trendingData && trendingData.challenges) {
        trendingQuestions = trendingData.challenges
          .filter(
            (challenge) => challenge.question && !challenge.question.isPaidOnly
          )
          .slice(0, 10)
          .map((challenge) => ({
            id: challenge.question.questionFrontendId,
            title: challenge.question.title,
            titleSlug: challenge.question.titleSlug,
            difficulty: challenge.question.difficulty,
            url: `https://leetcode.com/problems/${challenge.question.titleSlug}/`,
            acceptanceRate: parseFloat(challenge.question.acRate).toFixed(1),
            date: challenge.date,
            userStatus: challenge.userStatus,
            topicTags: challenge.question.topicTags.map((tag) => ({
              name: tag.name,
              slug: tag.slug,
            })),
            isDailyChallenge: true,
          }));
      }
    } catch (trendingErr) {
      console.warn("Could not fetch trending questions:", trendingErr.message);
    }

    // Final response
    return res.status(200).json({
      success: true,
      username: user.username,
      profileUrl,
      leetCodeStats,
      data: {
        name: user.profile.realName,
        avatar: user.profile.userAvatar,
        school: user.profile.school,
        country: user.profile.countryName,
        globalRanking: user.profile.ranking,
        totalSolved: submissions["All"] || 0,
        difficultyWiseSolved: {
          Easy: submissions["Easy"] || 0,
          Medium: submissions["Medium"] || 0,
          Hard: submissions["Hard"] || 0,
        },
        recentSolved,
        heatmap,
        latestQuestions,
        trendingQuestions,
      },
    });
  } catch (error) {
    console.error("Error fetching LeetCode data:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch LeetCode data",
      error: error.message,
    });
  }
};

// Helper function to fetch historical submissions
async function fetchHistoricalSubmissions(graphqlUrl, username, activeYears) {
  const allHistoricalData = [];

  for (const year of activeYears) {
    try {
      // Try to get year-specific data
      const yearQuery = {
        query: `
          query userCalendarYear($username: String!, $year: Int!) {
            matchedUser(username: $username) {
              userCalendar {
                submissionCalendar
              }
            }
          }
        `,
        variables: { username, year },
      };

      const yearResponse = await axios.post(graphqlUrl, yearQuery, {
        headers: { "Content-Type": "application/json" },
      });

      const yearCalendarData = yearResponse.data?.data?.matchedUser?.userCalendar;

      if (yearCalendarData?.submissionCalendar) {
        const rawCalendar = JSON.parse(yearCalendarData.submissionCalendar);
        const yearSubmissions = Object.entries(rawCalendar)
          .filter(([timestamp]) => {
            const date = new Date(Number(timestamp) * 1000);
            return date.getFullYear() === year;
          })
          .map(([timestamp, count]) => ({
            date: new Date(Number(timestamp) * 1000)
              .toISOString()
              .split("T")[0],
            count: Number(count),
          }));

        allHistoricalData.push(...yearSubmissions);
      }
    } catch (err) {
      console.warn(`Could not fetch data for year ${year}:`, err.message);
    }
  }

  return allHistoricalData;
}

// Helper function to fill missing dates
function fillMissingDates(submissions, startDate, endDate) {
  const filledData = [];
  const submissionMap = new Map();

  // Create a map of existing submissions
  submissions.forEach(sub => {
    submissionMap.set(sub.date, sub.count);
  });

  // Fill in all dates between start and end
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    filledData.push({
      date: dateStr,
      count: submissionMap.get(dateStr) || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledData;
}

// New endpoint to get questions by category/difficulty
exports.getLeetCodeQuestions = async (req, res) => {
  const { difficulty, category, limit = 20, skip = 0 } = req.query;

  try {
    const graphqlUrl = "https://leetcode.com/graphql";

    const filters = {};
    if (difficulty) {
      filters.difficulty = difficulty.toUpperCase();
    }
    if (category) {
      filters.tags = [category];
    }

    const questionsQuery = {
      query: `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total: totalNum
            questions: data {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              topicTags {
                name
                id
                slug
              }
              hasSolution
              hasVideoSolution
            }
          }
        }
      `,
      variables: {
        categorySlug: "",
        skip: parseInt(skip),
        limit: parseInt(limit),
        filters,
      },
    };

    const questionsResponse = await axios.post(graphqlUrl, questionsQuery, {
      headers: { "Content-Type": "application/json" },
    });

    const questionsData = questionsResponse.data?.data?.problemsetQuestionList;

    if (!questionsData) {
      return res.status(404).json({
        success: false,
        message: "Questions not found",
      });
    }

    const questions = questionsData.questions.map((question) => ({
      id: question.frontendQuestionId,
      title: question.title,
      titleSlug: question.titleSlug,
      difficulty: question.difficulty,
      url: `https://leetcode.com/problems/${question.titleSlug}/`,
      acceptanceRate: parseFloat(question.acRate).toFixed(1),
      status: question.status,
      isSolved: question.status === "ac",
      topicTags: question.topicTags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      })),
      hasSolution: question.hasSolution,
      hasVideoSolution: question.hasVideoSolution,
      isPremium: question.paidOnly,
    }));

    return res.status(200).json({
      success: true,
      total: questionsData.total,
      questions,
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: parseInt(skip) + parseInt(limit) < questionsData.total,
      },
    });
  } catch (error) {
    console.error("Error fetching LeetCode questions:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch LeetCode questions",
      error: error.message,
    });
  }
};

// New endpoint to get daily challenge
exports.getDailyChallenge = async (req, res) => {
  try {
    const graphqlUrl = "https://leetcode.com/graphql";

    const dailyQuery = {
      query: `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
              questionFrontendId
              title
              titleSlug
              content
              difficulty
              acRate
              likes
              dislikes
              topicTags {
                name
                slug
              }
              codeSnippets {
                lang
                langSlug
                code
              }
              sampleTestCase
              exampleTestcases
              isPaidOnly
            }
          }
        }
      `,
    };

    const dailyResponse = await axios.post(graphqlUrl, dailyQuery, {
      headers: { "Content-Type": "application/json" },
    });

    const dailyData = dailyResponse.data?.data?.activeDailyCodingChallengeQuestion;

    if (!dailyData) {
      return res.status(404).json({
        success: false,
        message: "Daily challenge not found",
      });
    }

    const challenge = {
      date: dailyData.date,
      userStatus: dailyData.userStatus,
      link: dailyData.link,
      question: {
        id: dailyData.question.questionFrontendId,
        title: dailyData.question.title,
        titleSlug: dailyData.question.titleSlug,
        content: dailyData.question.content,
        difficulty: dailyData.question.difficulty,
        url: `https://leetcode.com/problems/${dailyData.question.titleSlug}/`,
        acceptanceRate: parseFloat(dailyData.question.acRate).toFixed(1),
        likes: dailyData.question.likes,
        dislikes: dailyData.question.dislikes,
        topicTags: dailyData.question.topicTags.map((tag) => ({
          name: tag.name,
          slug: tag.slug,
        })),
        codeSnippets: dailyData.question.codeSnippets,
        sampleTestCase: dailyData.question.sampleTestCase,
        exampleTestcases: dailyData.question.exampleTestcases,
        isPremium: dailyData.question.isPaidOnly,
      },
    };

    return res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error("Error fetching daily challenge:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch daily challenge",
      error: error.message,
    });
  }
};

// Enhanced function to calculate comprehensive heatmap statistics
function calculateHeatmapStatistics(submissionsByDate) {
  if (!submissionsByDate || submissionsByDate.length === 0) {
    return {
      totalSubmissions: 0,
      totalActiveDays: 0,
      currentStreak: 0,
      longestStreak: 0,
      maxSubmissionsInDay: 0,
      averageSubmissionsPerDay: 0,
      streakRanges: [],
      monthlyStats: {},
      yearlyStats: {},
    };
  }

  // Sort by date for streak calculations
  const sortedSubmissions = submissionsByDate
    .filter((item) => item.count > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalSubmissions = submissionsByDate.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const totalActiveDays = sortedSubmissions.length;
  const maxSubmissionsInDay = Math.max(
    ...submissionsByDate.map((item) => item.count)
  );
  const averageSubmissionsPerDay =
    totalActiveDays > 0 ? (totalSubmissions / totalActiveDays).toFixed(2) : 0;

  // Calculate streaks
  const streakData = calculateStreaks(sortedSubmissions);

  // Calculate monthly and yearly statistics
  const monthlyStats = calculateMonthlyStats(submissionsByDate);
  const yearlyStats = calculateYearlyStats(submissionsByDate);

  return {
    totalSubmissions,
    totalActiveDays,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    maxSubmissionsInDay,
    averageSubmissionsPerDay: parseFloat(averageSubmissionsPerDay),
    streakRanges: streakData.streakRanges,
    monthlyStats,
    yearlyStats,
  };
}

// Fetch LeetCode question counts
const fetchLeetCodeQuestionCounts = async () => {
  const graphqlQuery = {
    query: `
      query {
        allQuestionsCount {
          difficulty
          count
        }
      }
    `,
  };

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      graphqlQuery,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data.data.allQuestionsCount;

    return {
      easy: data.find((item) => item.difficulty === "Easy")?.count || 0,
      medium: data.find((item) => item.difficulty === "Medium")?.count || 0,
      hard: data.find((item) => item.difficulty === "Hard")?.count || 0,
    };
  } catch (err) {
    console.error("LeetCode API Error:", err.message);
    return null;
  }
};

// Calculate current and longest streaks
function calculateStreaks(submissions) {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakRanges: [],
    };
  }

  // Ensure sorted by date ascending
  submissions.sort((a, b) => new Date(a.date) - new Date(b.date));

  const dates = submissions.map((item) => ({
    date: new Date(item.date),
    count: item.count,
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let streakRanges = [];
  let streakStart = null;

  // Calculate Current Streak
  const lastDate = new Date(dates[dates.length - 1].date);
  lastDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 1) {
    currentStreak = 1;
    let checkDate = new Date(lastDate);

    for (let i = dates.length - 2; i >= 0; i--) {
      const prevDate = new Date(dates[i].date);
      prevDate.setHours(0, 0, 0, 0);

      checkDate.setDate(checkDate.getDate() - 1);

      if (prevDate.getTime() === checkDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate Longest Streak & Ranges
  for (let i = 0; i < dates.length; i++) {
    const currDate = new Date(dates[i].date);
    currDate.setHours(0, 0, 0, 0);

    if (i === 0) {
      tempStreak = 1;
      streakStart = currDate;
    } else {
      const prevDate = new Date(dates[i - 1].date);
      prevDate.setHours(0, 0, 0, 0);

      const expected = new Date(prevDate);
      expected.setDate(expected.getDate() + 1);

      if (currDate.getTime() === expected.getTime()) {
        tempStreak++;
      } else {
        if (tempStreak >= 2) {
          const streakEnd = new Date(dates[i - 1].date);
          streakRanges.push({
            startDate: streakStart.toISOString().split("T")[0],
            endDate: streakEnd.toISOString().split("T")[0],
            length: tempStreak,
            submissions: submissions
              .slice(i - tempStreak, i)
              .reduce((sum, d) => sum + d.count, 0),
          });
        }

        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        streakStart = currDate;
      }
    }
  }

  // Check final streak
  if (tempStreak >= 2) {
    const streakEnd = new Date(dates[dates.length - 1].date);
    streakRanges.push({
      startDate: streakStart.toISOString().split("T")[0],
      endDate: streakEnd.toISOString().split("T")[0],
      length: tempStreak,
      submissions: submissions
        .slice(-tempStreak)
        .reduce((sum, d) => sum + d.count, 0),
    });
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Sort streaks by length descending
  streakRanges.sort((a, b) => b.length - a.length);

  return {
    currentStreak,
    longestStreak,
    streakRanges: streakRanges.slice(0, 10),
  };
}

// Calculate monthly statistics
function calculateMonthlyStats(submissionsByDate) {
  const monthlyStats = {};

  submissionsByDate.forEach((item) => {
    if (item.count > 0) {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          totalSubmissions: 0,
          activeDays: 0,
          maxSubmissionsInDay: 0,
          averageSubmissionsPerDay: 0,
        };
      }

      monthlyStats[monthKey].totalSubmissions += item.count;
      monthlyStats[monthKey].activeDays += 1;
      monthlyStats[monthKey].maxSubmissionsInDay = Math.max(
        monthlyStats[monthKey].maxSubmissionsInDay,
        item.count
      );
    }
  });

  // Calculate averages
  Object.keys(monthlyStats).forEach((month) => {
    const stats = monthlyStats[month];
    stats.averageSubmissionsPerDay = (
      stats.totalSubmissions / stats.activeDays
    ).toFixed(2);
  });

  return monthlyStats;
}

// Calculate yearly statistics
function calculateYearlyStats(submissionsByDate) {
  const yearlyStats = {};

  submissionsByDate.forEach((item) => {
    if (item.count > 0) {
      const year = new Date(item.date).getFullYear().toString();

      if (!yearlyStats[year]) {
        yearlyStats[year] = {
          totalSubmissions: 0,
          activeDays: 0,
          maxSubmissionsInDay: 0,
          averageSubmissionsPerDay: 0,
          months: new Set(),
        };
      }

      yearlyStats[year].totalSubmissions += item.count;
      yearlyStats[year].activeDays += 1;
      yearlyStats[year].maxSubmissionsInDay = Math.max(
        yearlyStats[year].maxSubmissionsInDay,
        item.count
      );
      yearlyStats[year].months.add(new Date(item.date).getMonth());
    }
  });

  // Calculate averages and convert months set to count
  Object.keys(yearlyStats).forEach((year) => {
    const stats = yearlyStats[year];
    stats.averageSubmissionsPerDay = (
      stats.totalSubmissions / stats.activeDays
    ).toFixed(2);
    stats.activeMonths = stats.months.size;
    delete stats.months;
  });

  return yearlyStats;
}




// Main controller function - Enhanced version of your original
exports.getGfgDetails = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res
      .status(400)
      .json({ success: false, message: "GFG username is required" });
  }

  try {
    // Attempt to fetch profile
    const profileResponse = await axios.get(`${BASE_URL}/${username}`);
    const { info, solvedStats } = profileResponse.data;

    if (!info || !info.userName) {
      return res
        .status(404)
        .json({
          success: false,
          message: "GFG user not found or invalid username",
        });
    }

    const year = new Date().getFullYear();
    let calendar = {};
    let heatmapData = [];

    try {
      const calendarResponse = await axios.get(
        `${BASE_URL}/${username}/calendar?year=${year}`
      );
      calendar = calendarResponse.data;

      // Generate heatmap data from calendar
      heatmapData = generateHeatmapData(calendar, year);
    } catch (calendarError) {
      console.warn("Calendar data not available:", calendarError.message);
      // Generate empty heatmap structure even if no calendar data
      heatmapData = generateEmptyHeatmapData(year);
    }

    // Enhanced profile data (optional scraping)
    let enhancedProfile = {};
    try {
      enhancedProfile = await getEnhancedProfileData(username);
    } catch (error) {
      console.warn("Enhanced profile data not available:", error.message);
    }

    // Calculate total questions count
    const totalQuestionsCount = calculateTotalQuestions(solvedStats);

    // Generate insights and analysis
    const insights = generateInsights(solvedStats, calendar, info);
    const difficultyAnalysis = getDifficultyAnalysis(solvedStats);
    const activityMetrics = calculateActivityMetrics(calendar);

    return res.status(200).json({
      success: true,
      message: "GFG data fetched successfully",
      data: {
        profile: {
          username: info.userName,
          fullName: info.fullName,
          institution: info.institution,
          rank: info.rank,
          score: info.score,
          streak: info.streak,
          totalProblemsSolved: info.totalSolved,
          totalQuestionsCount,
          // Enhanced profile fields
          profileImageUrl: enhancedProfile.profileImageUrl || null,
          bio: enhancedProfile.bio || null,
          location: enhancedProfile.location || null,
          joinDate: enhancedProfile.joinDate || null,
          badges: enhancedProfile.badges || [],
          following: enhancedProfile.following || 0,
          followers: enhancedProfile.followers || 0,
          profileCompleteness: calculateProfileCompleteness(
            info,
            enhancedProfile
          ),
        },
        solvedStats,
        calendar,
        heatmap: heatmapData,
        insights,
        difficultyAnalysis,
        activityMetrics,
      },
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "GFG user not found or API doesn't support this username yet",
        error: error.response.data,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch GFG details",
      error: error.message,
    });
  }
};

// Helper function to get enhanced profile data through scraping
async function getEnhancedProfileData(username) {
  try {
    const profileUrl = `https://auth.geeksforgeeks.org/user/${username}`;
    const response = await axios.get(profileUrl);
    const $ = cheerio.load(response.data);

    return {
      profileImageUrl: $(".profile_pic img").attr("src") || null,
      bio: $(".profile_bio").text().trim() || null,
      location: $(".location_details").text().trim() || null,
      joinDate: $(".join_date").text().trim() || null,
      following: parseInt($(".following_count").text().trim()) || 0,
      followers: parseInt($(".followers_count").text().trim()) || 0,
      badges: $(".badge_item")
        .map((i, el) => $(el).text().trim())
        .get(),
      socialLinks: {
        linkedin: $(".social_links .linkedin").attr("href") || null,
        github: $(".social_links .github").attr("href") || null,
        twitter: $(".social_links .twitter").attr("href") || null,
      },
    };
  } catch (error) {
    console.warn("Error fetching enhanced profile data:", error.message);
    return {};
  }
}

// Helper function to calculate total questions count
function calculateTotalQuestions(solvedStats) {
  if (!solvedStats || typeof solvedStats !== "object") {
    return 0;
  }

  let total = 0;

  // Handle the actual structure: easy, medium, basic, hard objects with count property
  if (solvedStats.easy && solvedStats.medium && solvedStats.hard) {
    total =
      (solvedStats.easy.count || 0) +
      (solvedStats.medium.count || 0) +
      (solvedStats.hard.count || 0) +
      (solvedStats.basic?.count || 0); // basic is optional
  } else if (Array.isArray(solvedStats)) {
    total = solvedStats.reduce((sum, stat) => sum + (stat.count || 0), 0);
  } else if (solvedStats.total) {
    total = solvedStats.total;
  } else {
    // Fallback: sum all count values from objects
    total = Object.values(solvedStats).reduce((sum, value) => {
      if (value && typeof value === "object" && value.count) {
        return sum + value.count;
      }
      return sum + (typeof value === "number" ? value : 0);
    }, 0);
  }

  return total;
}

// Helper function to generate heatmap data
function generateHeatmapData(calendar, year) {
  const heatmapData = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateString = date.toISOString().split("T")[0];
    const dayData = calendar[dateString] || null;

    let count = 0;
    if (dayData !== null) {
      if (typeof dayData === "number") {
        count = dayData;
      } else if (dayData.count) {
        count = dayData.count;
      } else if (dayData.problemsSolved) {
        count = dayData.problemsSolved;
      } else if (dayData.submissions) {
        count = dayData.submissions;
      } else if (dayData.solved) {
        count = dayData.solved;
      }
    }

    let intensity = 0;
    if (count > 0) {
      intensity = count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4;
    }

    heatmapData.push({
      date: dateString,
      count,
      intensity,
      dayOfWeek: date.getDay(),
      week: Math.ceil((date - startDate) / (7 * 24 * 60 * 60 * 1000)),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
  }

  const activeYears = Array.from(
    new Set(heatmapData.map(item => new Date(item.date).getFullYear()))
  );

  return {
    heatmap: heatmapData,
    activeYears
  };
}
// Helper function to generate empty heatmap data when calendar is not available
function generateEmptyHeatmapData(year) {
  const heatmapData = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateString = date.toISOString().split("T")[0];

    heatmapData.push({
      date: dateString,
      count: 0,
      intensity: 0,
      dayOfWeek: date.getDay(),
      week: Math.ceil((date - startDate) / (7 * 24 * 60 * 60 * 1000)),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
  }

  return heatmapData;
}

// Helper function to generate insights
function generateInsights(solvedStats, calendar, info) {
  const insights = [];
  const total = calculateTotalQuestions(solvedStats);

  // Problem count insights
  if (total > 1000) {
    insights.push(
      "🏆 Problem Solving Legend! You've solved over 1000 problems!"
    );
  } else if (total > 500) {
    insights.push(
      "🏆 Problem Solving Master! You've solved over 500 problems."
    );
  } else if (total > 100) {
    insights.push(
      "💪 Great Progress! You're building strong problem-solving skills."
    );
  } else if (total > 50) {
    insights.push("🌟 Good Start! Keep practicing to improve further.");
  }

  // Rank insights
  if (info.rank && info.rank <= 1000) {
    insights.push("🌟 Top Performer! You're among the top-ranked users.");
  } else if (info.rank && info.rank <= 5000) {
    insights.push("👍 Strong Performance! You're in the top tier of users.");
  }

  // Streak insights
  if (info.streak && info.streak > 50) {
    insights.push("🔥 Incredible Streak! Your consistency is outstanding.");
  } else if (info.streak && info.streak > 20) {
    insights.push("🔥 Great Streak! Keep up the consistent practice.");
  }

  // Difficulty insights
  const hardCount = solvedStats.hard?.count || 0;
  const hardPercentage = total > 0 ? (hardCount / total) * 100 : 0;
  if (hardPercentage > 25) {
    insights.push(
      "🧠 Challenge Master! You tackle difficult problems regularly."
    );
  } else if (hardPercentage > 15) {
    insights.push(
      "🧠 Challenge Seeker! You're comfortable with hard problems."
    );
  }

  // Activity insights
  const activeDays = Object.values(calendar).filter(
    (day) => day && day.count > 0
  ).length;
  if (activeDays > 300) {
    insights.push("📅 Daily Coder! You practice almost every day.");
  } else if (activeDays > 200) {
    insights.push("📅 Consistent Coder! You maintain regular practice.");
  }

  return insights;
}

// Helper function to analyze difficulty distribution
function getDifficultyAnalysis(solvedStats) {
  const total = calculateTotalQuestions(solvedStats);
  const easy = solvedStats.easy?.count || 0;
  const medium = solvedStats.medium?.count || 0;
  const hard = solvedStats.hard?.count || 0;
  const basic = solvedStats.basic?.count || 0;

  return {
    breakdown: {
      easy: {
        count: easy,
        percentage: total > 0 ? ((easy / total) * 100).toFixed(1) : 0,
      },
      medium: {
        count: medium,
        percentage: total > 0 ? ((medium / total) * 100).toFixed(1) : 0,
      },
      hard: {
        count: hard,
        percentage: total > 0 ? ((hard / total) * 100).toFixed(1) : 0,
      },
      basic: {
        count: basic,
        percentage: total > 0 ? ((basic / total) * 100).toFixed(1) : 0,
      },
    },
    difficultyScore: basic * 1 + easy * 2 + medium * 5 + hard * 10,
    recommendation: getRecommendation(easy, medium, hard, total),
    level: getDifficultyLevel(easy, medium, hard, total),
  };
}

// Helper function to get recommendation
function getRecommendation(easy, medium, hard, total) {
  if (total === 0) return "Start with basic problems to build your foundation!";

  const easyPercentage = (easy / total) * 100;
  const mediumPercentage = (medium / total) * 100;
  const hardPercentage = (hard / total) * 100;

  if (hardPercentage < 5 && total > 50) {
    return "Try solving more hard problems to challenge yourself!";
  } else if (mediumPercentage < 20 && total > 20) {
    return "Focus on medium difficulty problems to build confidence.";
  } else if (easyPercentage > 80 && total > 30) {
    return "Great foundation! Challenge yourself with harder problems.";
  } else if (hardPercentage > 30) {
    return "Excellent! You're tackling challenging problems regularly.";
  }
  return "Keep up the consistent practice across all difficulty levels!";
}

// Helper function to determine difficulty level
function getDifficultyLevel(easy, medium, hard, total) {
  const score = easy * 1 + medium * 3 + hard * 5;

  if (score > 2000) return "Expert";
  if (score > 1000) return "Advanced";
  if (score > 500) return "Intermediate";
  if (score > 100) return "Beginner";
  return "Novice";
}

// Helper function to calculate activity metrics
function calculateActivityMetrics(calendar) {
  const days = Object.values(calendar);
  const activeDays = days.filter((day) => day && day.count > 0);
  const totalProblems = activeDays.reduce(
    (sum, day) => sum + (day.count || 0),
    0
  );

  // Calculate streaks
  const streaks = calculateStreaks(calendar);

  // Calculate weekly pattern
  const weeklyPattern = calculateWeeklyPattern(calendar);

  return {
    totalActiveDays: activeDays.length,
    totalProblems: totalProblems,
    averageProblemsPerDay:
      activeDays.length > 0
        ? (totalProblems / activeDays.length).toFixed(2)
        : 0,
    activeDaysPercentage: ((activeDays.length / days.length) * 100).toFixed(1),
    maxProblemsInDay: Math.max(...activeDays.map((day) => day.count || 0), 0),
    currentStreak: streaks.current,
    maxStreak: streaks.max,
    weeklyPattern: weeklyPattern,
    consistencyScore: calculateConsistencyScore(
      activeDays.length,
      days.length,
      streaks.max
    ),
  };
}

// Helper function to calculate streaks
function calculateStreaks(calendar) {
  const dates = Object.keys(calendar).sort();
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  const today = new Date().toISOString().split("T")[0];

  for (const date of dates) {
    const dayData = calendar[date];
    if (dayData && dayData.count > 0) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak (from today backwards)
  const sortedDates = dates.sort().reverse();
  for (const date of sortedDates) {
    if (date > today) continue;
    const dayData = calendar[date];
    if (dayData && dayData.count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { current: currentStreak, max: maxStreak };
}

// Helper function to calculate weekly pattern
function calculateWeeklyPattern(calendar) {
  const weeklyData = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  Object.entries(calendar).forEach(([date, data]) => {
    if (data && data.count > 0) {
      const dayOfWeek = new Date(date).getDay();
      weeklyData[dayOfWeek] += data.count;
    }
  });

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const mostActiveDay =
    days[
      Object.keys(weeklyData).reduce((a, b) =>
        weeklyData[a] > weeklyData[b] ? a : b
      )
    ];

  return {
    weeklyData,
    mostActiveDay,
    weekendActivity: weeklyData[0] + weeklyData[6],
    weekdayActivity:
      weeklyData[1] +
      weeklyData[2] +
      weeklyData[3] +
      weeklyData[4] +
      weeklyData[5],
  };
}

// Helper function to calculate consistency score
function calculateConsistencyScore(activeDays, totalDays, maxStreak) {
  const activityRate = (activeDays / totalDays) * 100;
  const streakBonus = Math.min(maxStreak / 30, 1) * 20; // Max 20 bonus points
  return Math.min(activityRate + streakBonus, 100).toFixed(1);
}

// Helper function to calculate profile completeness
function calculateProfileCompleteness(info, enhancedProfile) {
  const fields = [
    info.userName,
    info.fullName,
    info.institution,
    enhancedProfile.bio,
    enhancedProfile.location,
    enhancedProfile.profileImageUrl,
  ];

  const completedFields = fields.filter(
    (field) => field && field.trim() !== ""
  ).length;
  return ((completedFields / fields.length) * 100).toFixed(0);
}

// Optional: Additional endpoint to get only heatmap data
exports.getGfgHeatmap = async (req, res) => {
  const { username } = req.params;
  const { year } = req.query;

  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  if (!username) {
    return res
      .status(400)
      .json({ success: false, message: "GFG username is required" });
  }

  try {
    const calendarResponse = await axios.get(
      `${BASE_URL}/${username}/calendar?year=${targetYear}`
    );
    const calendar = calendarResponse.data;

    const heatmapData = generateHeatmapData(calendar, targetYear);

    // Calculate summary statistics
    const totalDays = heatmapData.length;
    const activeDays = heatmapData.filter((day) => day.count > 0).length;
    const totalSolved = heatmapData.reduce((sum, day) => sum + day.count, 0);
    const maxStreak = calculateMaxStreak(heatmapData);
    const currentStreak = calculateCurrentStreak(heatmapData);

    return res.status(200).json({
      success: true,
      message: "GFG heatmap data fetched successfully",
      data: {
        year: targetYear,
        heatmap: heatmapData,
        summary: {
          totalDays,
          activeDays,
          totalSolved,
          maxStreak,
          currentStreak,
          activityRate: ((activeDays / totalDays) * 100).toFixed(2),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch GFG heatmap data",
      error: error.message,
    });
  }
};

// Helper function to calculate maximum streak
function calculateMaxStreak(heatmapData) {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const day of heatmapData) {
    if (day.count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

// Helper function to calculate current streak
function calculateCurrentStreak(heatmapData) {
  let currentStreak = 0;
  const today = new Date().toISOString().split("T")[0];

  // Start from today and go backwards
  for (let i = heatmapData.length - 1; i >= 0; i--) {
    const day = heatmapData[i];
    if (day.date > today) continue; // Skip future dates

    if (day.count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return currentStreak;
}

exports.getGfgInsights = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res
      .status(400)
      .json({ success: false, message: "GFG username is required" });
  }

  try {
    const profileResponse = await axios.get(`${BASE_URL}/${username}`);
    const { info, solvedStats } = profileResponse.data;

    const year = new Date().getFullYear();
    const calendarResponse = await axios.get(
      `${BASE_URL}/${username}/calendar?year=${year}`
    );
    const calendar = calendarResponse.data;

    const insights = generateInsights(solvedStats, calendar, info);
    const difficultyAnalysis = getDifficultyAnalysis(solvedStats);
    const activityMetrics = calculateActivityMetrics(calendar);

    return res.status(200).json({
      success: true,
      message: "GFG insights fetched successfully",
      data: {
        username: info.userName,
        insights,
        difficultyAnalysis,
        activityMetrics,
        summary: {
          totalProblems: calculateTotalQuestions(solvedStats),
          rank: info.rank,
          score: info.score,
          streak: info.streak,
          level: getDifficultyLevel(
            solvedStats.easy?.count || 0,
            solvedStats.medium?.count || 0,
            solvedStats.hard?.count || 0,
            calculateTotalQuestions(solvedStats)
          ),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch GFG insights",
      error: error.message,
    });
  }
};

exports.getCodeforcesDetails = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Codeforces username is required",
    });
  }

  try {
    // Fetch user info
    const userInfoResponse = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    const user = userInfoResponse.data.result[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Codeforces user not found",
      });
    }

    // Fetch rating history
    const ratingResponse = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );
    const ratingHistory = ratingResponse.data.result;

    // Fetch submissions for heatmap and difficulty stats
    const submissionsResponse = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );
    const submissions = submissionsResponse.data.result;

    const heatmap = generateCfHeatmap(submissions);
    const difficultyStats = generateDifficultyStats(submissions);
    const recentlySolved = getRecentlySolvedProblems(submissions);

    return res.status(200).json({
      success: true,
      message: "Codeforces data fetched successfully",
      data: {
        profile: {
          username: user.handle,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          rank: user.rank,
          maxRank: user.maxRank,
          rating: user.rating,
          maxRating: user.maxRating,
          country: user.country || "",
          organization: user.organization || "",
          contribution: user.contribution,
          friendOfCount: user.friendOfCount,
        },
        ratingHistory,
        heatmap,
        difficultyStats,
        recentlySolved,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Codeforces data",
      error: error.message,
    });
  }
};

// Helper to generate heatmap from submissions
function generateCfHeatmap(submissions) {
  const heatmap = {};
  submissions.forEach((submission) => {
    const date = new Date(submission.creationTimeSeconds * 1000)
      .toISOString()
      .split("T")[0]; // yyyy-mm-dd

    if (heatmap[date]) {
      heatmap[date]++;
    } else {
      heatmap[date] = 1;
    }
  });

  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const today = new Date();
  const data = [];

  for (let d = new Date(startOfYear); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const count = heatmap[dateStr] || 0;
    let intensity = 0;

    if (count === 0) intensity = 0;
    else if (count <= 2) intensity = 1;
    else if (count <= 5) intensity = 2;
    else if (count <= 10) intensity = 3;
    else intensity = 4;

    data.push({
      date: dateStr,
      count,
      intensity,
      dayOfWeek: d.getDay(),
      week: Math.ceil((d - startOfYear) / (7 * 24 * 60 * 60 * 1000)),
      month: d.getMonth() + 1,
      day: d.getDate(),
    });
  }

  return data;
}

function generateDifficultyStats(submissions) {
  const difficultyStats = {
    "Easy (≤1200)": 0,
    "Medium (1201-1800)": 0,
    "Hard (1801-2400)": 0,
    "Very Hard (2401+)": 0,
    Unrated: 0,
  };

  const solvedSet = new Set();

  submissions.forEach((submission) => {
    if (submission.verdict === "OK") {
      const problem = submission.problem;
      const problemId = `${problem.contestId}-${problem.index}`;

      if (!solvedSet.has(problemId)) {
        solvedSet.add(problemId);
        const rating = problem.rating;

        if (!rating) {
          difficultyStats["Unrated"]++;
        } else if (rating <= 1200) {
          difficultyStats["Easy (≤1200)"]++;
        } else if (rating <= 1800) {
          difficultyStats["Medium (1201-1800)"]++;
        } else if (rating <= 2400) {
          difficultyStats["Hard (1801-2400)"]++;
        } else {
          difficultyStats["Very Hard (2401+)"]++;
        }
      }
    }
  });

  return difficultyStats;
}

// NEW: Helper to get recently solved problems
function getRecentlySolvedProblems(submissions, limit = 10) {
  const solvedProblems = [];
  const solvedSet = new Set();

  // Sort submissions by creation time (newest first)
  const sortedSubmissions = submissions
    .filter((submission) => submission.verdict === "OK")
    .sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds);

  for (const submission of sortedSubmissions) {
    const problem = submission.problem;
    const problemId = `${problem.contestId}-${problem.index}`;

    // Only add if we haven't seen this problem before
    if (!solvedSet.has(problemId)) {
      solvedSet.add(problemId);

      const solvedDate = new Date(submission.creationTimeSeconds * 1000);
      const now = new Date();
      const daysAgo = Math.floor((now - solvedDate) / (1000 * 60 * 60 * 24));

      solvedProblems.push({
        problemId,
        contestId: problem.contestId,
        index: problem.index,
        name: problem.name,
        rating: problem.rating || null,
        tags: problem.tags || [],
        solvedAt: solvedDate.toISOString(),
        daysAgo,
        url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
        contestUrl: `https://codeforces.com/contest/${problem.contestId}`,
        difficulty: getDifficultyLevel(problem.rating),
        programmingLanguage: submission.programmingLanguage,
        timeConsumedMillis: submission.timeConsumedMillis,
        memoryConsumedBytes: submission.memoryConsumedBytes,
      });

      // Stop when we reach the limit
      if (solvedProblems.length >= limit) {
        break;
      }
    }
  }

  return {
    problems: solvedProblems,
    totalRecent: solvedProblems.length,
    summary: {
      last7Days: solvedProblems.filter((p) => p.daysAgo <= 7).length,
      last30Days: solvedProblems.filter((p) => p.daysAgo <= 30).length,
      averageRating:
        solvedProblems
          .filter((p) => p.rating)
          .reduce((sum, p, _, arr) => sum + p.rating / arr.length, 0) || 0,
      mostUsedLanguage: getMostUsedLanguage(solvedProblems),
      topTags: getTopTags(solvedProblems),
    },
  };
}

// Helper to determine difficulty level from rating
function getDifficultyLevel(rating) {
  if (!rating) return "Unrated";
  if (rating <= 1200) return "Easy";
  if (rating <= 1800) return "Medium";
  if (rating <= 2400) return "Hard";
  return "Very Hard";
}

// Helper to get most used programming language
function getMostUsedLanguage(problems) {
  const langCount = {};
  problems.forEach((p) => {
    langCount[p.programmingLanguage] =
      (langCount[p.programmingLanguage] || 0) + 1;
  });

  return (
    Object.entries(langCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"
  );
}

// Helper to get top problem tags
function getTopTags(problems, limit = 5) {
  const tagCount = {};
  problems.forEach((p) => {
    p.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

exports.getHackerRankDetails = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username required",
    });
  }

  const profileUrl = `https://www.hackerrank.com/profile/${username}`;

  try {
    const { data: html } = await axios.get(profileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0",
      },
      timeout: 10000,
      validateStatus: (status) => status < 500, // Accept 4xx errors to handle them gracefully
    });

    if (!html || html.length < 100) {
      return res.status(404).json({
        success: false,
        message: "Profile not found or empty response",
      });
    }

    // Multiple patterns to search for data
    const patterns = [
      // Pattern 1: __PRELOADED_STATE__
      /window\.__PRELOADED_STATE__\s*=\s*(\{.+?\});/s,
      // Pattern 2: __INITIAL_STATE__
      /window\.__INITIAL_STATE__\s*=\s*(\{.+?\});/s,
      // Pattern 3: REDUX_STATE
      /window\.REDUX_STATE\s*=\s*(\{.+?\});/s,
      // Pattern 4: Profile data in script tags
      /<script[^>]*>\s*window\.__APP_STATE__\s*=\s*(\{.+?\});\s*<\/script>/s,
      // Pattern 5: JSON-LD structured data
      /<script[^>]*type="application\/ld\+json"[^>]*>(\{.+?\})<\/script>/s,
      // Pattern 6: Profile specific data
      /<script[^>]*>[^<]*"profile"[^<]*(\{[^}]*"username"[^}]*\})[^<]*<\/script>/s,
    ];

    let parsed = null;
    let rawData = null;

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        try {
          rawData = match[1];
          parsed = JSON.parse(rawData);
          if (parsed && (parsed.profile || parsed.user || parsed.pageProps)) {
            break;
          }
        } catch (e) {
          console.log(`Failed to parse pattern: ${e.message}`);
          continue;
        }
      }
    }

    if (!parsed) {
      // Fallback: Try to extract basic info from HTML
      const basicInfo = extractBasicInfoFromHTML(html, username);
      if (basicInfo) {
        return res.status(200).json({
          success: true,
          message: "Limited data extracted from HTML",
          data: basicInfo,
        });
      }

      return res.status(404).json({
        success: false,
        message:
          "Could not extract user data. Profile may be private or structure changed.",
      });
    }

    // Extract user data from different possible structures
    let userData = null;
    let profileData = null;

    // Try different data structures
    if (parsed.profile) {
      userData = parsed.profile;
    } else if (parsed.pageProps?.profile) {
      userData = parsed.pageProps.profile;
    } else if (parsed.user) {
      userData = { user: parsed.user };
    } else if (parsed.entities?.users) {
      const userKeys = Object.keys(parsed.entities.users);
      if (userKeys.length > 0) {
        userData = { user: parsed.entities.users[userKeys[0]] };
      }
    }

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User data structure not recognized",
      });
    }

    const user = userData.user || userData;

    if (!user || !user.username) {
      return res.status(404).json({
        success: false,
        message: "No valid user data found",
      });
    }

    // Extract additional data
    const badges = userData.badges || [];
    const leaderboard = userData.leaderboard || {};
    const domains = leaderboard.domains || [];
    const submissions = userData.submissions || [];
    const contests = userData.contests || [];

    // Calculate statistics
    const totalScore = domains.reduce((sum, d) => sum + (d.score || 0), 0);
    const topDomain = domains.reduce(
      (best, curr) => ((curr.score || 0) > (best?.score || 0) ? curr : best),
      null
    );

    // Calculate additional metrics
    const solvedChallenges = submissions.filter(
      (s) => s.status === "accepted"
    ).length;
    const totalSubmissions = submissions.length;
    const successRate =
      totalSubmissions > 0
        ? ((solvedChallenges / totalSubmissions) * 100).toFixed(1)
        : 0;

    const response = {
      success: true,
      message: "HackerRank profile fetched successfully",
      data: {
        profile: {
          username: user.username,
          name: user.name || user.display_name || "",
          avatar: user.avatar || user.profile_image || "",
          country: user.country || "",
          company: user.company || "",
          school: user.school || "",
          created_at: user.created_at || null,
          followers: user.followers_count || 0,
          following: user.following_count || 0,
        },
        statistics: {
          totalScore,
          topDomain: topDomain?.name || null,
          topDomainScore: topDomain?.score || 0,
          solvedChallenges,
          totalSubmissions,
          successRate: parseFloat(successRate),
          rank: user.rank || null,
          level: user.level || null,
        },
        domains: domains.map((d) => ({
          name: d.name,
          score: d.score || 0,
          rank: d.rank || null,
          level: d.level || null,
          problems_solved: d.problems_solved || 0,
        })),
        badges: badges.map((b) => ({
          name: b.name || "",
          description: b.description || "",
          level: b.level || "",
          earned_date: b.earned_date || null,
        })),
        recentActivity: {
          contestsParticipated: contests.length,
          recentSubmissions: submissions.slice(0, 10).map((s) => ({
            challenge: s.challenge_name || "",
            status: s.status || "",
            score: s.score || 0,
            language: s.language || "",
            submitted_at: s.submitted_at || null,
          })),
        },
      },
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("HackerRank fetch error:", err.message);

    // Handle specific error types
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message: "HackerRank service unavailable",
      });
    }

    if (err.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "HackerRank profile not found",
      });
    }

    if (err.response?.status === 403) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Profile may be private or blocked.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch HackerRank profile",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Fallback function to extract basic info from HTML
function extractBasicInfoFromHTML(html, username) {
  try {
    // Try to extract basic profile info from HTML structure
    const nameMatch =
      html.match(
        /<h1[^>]*class="[^"]*profile-heading[^"]*"[^>]*>([^<]+)<\/h1>/i
      ) ||
      html.match(/<div[^>]*class="[^"]*username[^"]*"[^>]*>([^<]+)<\/div>/i);

    const avatarMatch =
      html.match(/<img[^>]*src="([^"]*avatar[^"]*)"[^>]*>/i) ||
      html.match(/<img[^>]*class="[^"]*avatar[^"]*"[^>]*src="([^"]*)"[^>]*>/i);

    if (nameMatch || avatarMatch) {
      return {
        profile: {
          username: username,
          name: nameMatch ? nameMatch[1].trim() : "",
          avatar: avatarMatch ? avatarMatch[1] : "",
          country: "",
          company: "",
          school: "",
        },
        statistics: {
          totalScore: 0,
          topDomain: null,
          topDomainScore: 0,
          solvedChallenges: 0,
          totalSubmissions: 0,
          successRate: 0,
          rank: null,
          level: null,
        },
        domains: [],
        badges: [],
        recentActivity: {
          contestsParticipated: 0,
          recentSubmissions: [],
        },
      };
    }

    return null;
  } catch (e) {
    console.error("HTML parsing error:", e.message);
    return null;
  }
}
