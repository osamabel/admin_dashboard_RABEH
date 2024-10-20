import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonLoading } from "@/components/ui/ButtonLoading";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace with your actual authentication logic
    if (username === "user" && password === "password") {
      localStorage.setItem("token", "your-auth-token");
      navigate("/home");
    } else {
      setIsError(true)
    //   alert("Invalid credentials");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter Your Credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {
                isLoading ?
                <ButtonLoading />:
                <Button type="submit">Login</Button>
            }
          </form>
        </CardContent>
        <CardFooter>
          {isError && <p className="text-[12px] text-red-600">Please Enter The Correct Credentials</p>} 
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
