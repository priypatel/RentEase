

export default function Register() {
  return (
    <div>
      <h1>Register Page</h1>
      <form className="flex flex-col items-center justify-center  ">
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}