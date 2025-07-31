"use client";
import { useGetUsersQuery, useLoginMutation } from "@/services/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { decrement, increment } from "@/store/slices/student/counterSlice";
import React from "react";

const TestComponent = () => {
  const state = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const { data: users, isLoading } = useGetUsersQuery();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {state.count}
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button
        onClick={() =>
          login({ email: "bob@example.com", password: "bob123" }).unwrap()
        }
      >
        Login
      </button>
    </div>
  );
};

export default TestComponent;
