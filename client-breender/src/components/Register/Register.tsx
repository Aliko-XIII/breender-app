import './Register.scss';

export const Register = () => {
    return <div className="register-block">
        <h1 className="register-header">
            Sign Up
        </h1>
        <form method="post" className="register-form">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" />
            <label htmlFor="pass">Password:</label>
            <input type="password" name="pass" id="pass" />
            <label htmlFor="pass-repeat">Password:</label>
            <input type="password" name="pass-repeat" id="pass-repeat" />
            <input type="submit" value="Sign Up" className='register-btn'/>
            <a href="http://" target="_blank" rel="noopener noreferrer">Already have an account?</a>
        </form>
    </div>;
}