import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate("/dashboard"); // Redirect to dashboard if token exists
        }
    }, [token, navigate]);

    if (token) return null; // Prevent rendering when navigating

    return children; // Render children if token is null (user not logged in)
        //yha children ka mtlb gai jo hmne app.js me private route ke andr dashboard dia h 
};

export default PublicRoute;
