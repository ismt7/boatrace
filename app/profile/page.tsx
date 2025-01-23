"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

type UserData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export default function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>();

  const [users, setUsers] = useState<UserData[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      console.log("User deleted:", id);
      fetchUsers(); // Fetch users again after deletion
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data: UserData) => {
    console.log(data);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to register user: ${errorData.message}`);
      }

      const result = await response.json();
      console.log("User registered:", result);
      fetchUsers(); // Fetch users again after registration
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">プロフィールページ</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            名:
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: true })}
            className={`
              mt-1 block w-full h-10 px-3 border border-gray-400 rounded-md shadow-sm 
              focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm caret-indigo-500
            `}
          />
          {errors.firstName && (
            <span className="text-red-500 text-sm">名は必須です</span>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            姓:
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: true })}
            className={`
              mt-1 block w-full h-10 px-3 border border-gray-400 rounded-md shadow-sm 
              focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm caret-indigo-500
            `}
          />
          {errors.lastName && (
            <span className="text-red-500 text-sm">姓は必須です</span>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            メール:
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className={`
              mt-1 block w-full h-10 px-3 border border-gray-400 rounded-md shadow-sm 
              focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm caret-indigo-500
            `}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">メールは必須です</span>
          )}
        </div>
        <button
          type="submit"
          className={`
            inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
            rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          `}
        >
          送信
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">登録ユーザー一覧</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index} className="mb-2 flex justify-between items-center">
              <span>
                {user.firstName} {user.lastName} ({user.email})
              </span>
              <button
                onClick={() => deleteUser(user.id)}
                className={`
                  ml-4 inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium 
                  rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                `}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
