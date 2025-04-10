import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { insertUserSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  function onRegisterSubmit(data: RegisterFormValues) {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  }

  return (
    <div className="flex min-h-screen">
      {/* Form Column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Sign In
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setActiveTab("register")}
                  >
                    Sign Up
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john.doe@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setActiveTab("login")}
                  >
                    Sign In
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center">
        <div className="max-w-md p-8 text-white">
          <h1 className="text-4xl font-bold mb-6">Find Your Dream Job</h1>
          <p className="text-xl mb-6">
            Swipe right on your career opportunities. Match with companies that match your skills and aspirations.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <div className="mr-3 text-xl">✓</div>
              <span>Create your profile once</span>
            </li>
            <li className="flex items-center">
              <div className="mr-3 text-xl">✓</div>
              <span>Swipe on jobs that interest you</span>
            </li>
            <li className="flex items-center">
              <div className="mr-3 text-xl">✓</div>
              <span>Get matched with interested recruiters</span>
            </li>
            <li className="flex items-center">
              <div className="mr-3 text-xl">✓</div>
              <span>Track your application progress</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}