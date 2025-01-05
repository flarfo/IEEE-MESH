import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const VerifyEmail = () => {
    const [validUrl, setValidUrl] = useState(true);
	const params = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_DEV_API_URL}/users/${params.id}/verify/${params.token}`);
				
                if (!response.ok) {
				    setValidUrl(false);
                }
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [params]);

	return (
		<>
			{validUrl ? (
				<div>
					<h1>Email verified successfully</h1>
					<Link to='/login'>
						<button>Login</button>
					</Link>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</>
	);
};

export default VerifyEmail;