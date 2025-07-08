import React from 'react'
import { Link } from 'react-router-dom';
import LeetCode from '../../assets/leetcode.png';
import CodeForces from '../../assets/codeforces.png';
import HackerRank from '../../assets/hackerrank.png';
import CodeChef from '../../assets/codechef.png';
import GFG from '../../assets/gfg.png';
const Platforms = () => {
      const platforms = [
    { name: "LeetCode", logo: LeetCode, color: "bg-orange-500", link:"https://leetcode.com/" },
    { name: "CodeForces", logo: CodeForces, color: "bg-blue-500",link:"https://codeforces.com/" },
    { name: "HackerRank", logo: HackerRank, color: "bg-green-500" , link:"https://www.hackerrank.com/" },
    { name: "CodeChef", logo: CodeChef, color: "bg-yellow-500"  , link:"https://www.codechef.com/" },
    { name: "GeeksForGeeks", logo: GFG, color: "bg-red-500" , link:"https://www.geeksforgeeks.org/" },
  ];
  return (
    <div>
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Connect Multiple Platforms
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Seamlessly integrate with popular coding platforms and get
                unified insights
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {platforms.map((platform, index) => (
                <Link to={platform.link} key={index}>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-colors text-center group">
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="h-12 mx-auto mb-4"
                    />
                    <h3 className="font-semibold group-hover:text-purple-300 transition-colors">
                      {platform.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
    </div>
  )
}

export default Platforms
