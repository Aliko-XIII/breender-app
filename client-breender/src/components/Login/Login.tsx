import './Login.scss';

export const Login = () => {
    return <div className="login-block">
        <h1 className='login-header'>
            Login
        </h1>
        <form method="post" className="login-form">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" />
            <label htmlFor="pass">Password:</label>
            <input type="password" name="pass" id="pass" />
            <input type="submit" value="Login" className='login-btn'/>
            <a href="http://" target="_blank" rel="noopener noreferrer">Forgot your password?</a>
        </form>
    </div>;
}