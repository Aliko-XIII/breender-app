export const Register = () => {
    return <>
        <h1>
            Register page
        </h1>
        <form method="post">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" />
            <label htmlFor="pass">Password:</label>
            <input type="password" name="pass" id="pass" />
            <label htmlFor="pass-repeat">Password:</label>
            <input type="password" name="pass-repeat" id="pass-repeat" />
            <input type="submit" value="Login" />
            <a href="http://" target="_blank" rel="noopener noreferrer">Already have an account?</a>
        </form>
    </>;
}