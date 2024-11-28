export const Login = () => {
    return <>
        <h1>
            Login page
        </h1>
        <form method="post">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" />
            <label htmlFor="pass">Password:</label>
            <input type="password" name="pass" id="pass" />
            <input type="submit" value="Login" />
            <a href="http://" target="_blank" rel="noopener noreferrer">Forgot your password?</a>
        </form>
    </>;
}