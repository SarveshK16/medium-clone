import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { SignupInput } from "@sarveshsk/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";


export const Auth = ({ type }: { type: "signup" | "signin" }) => {

    const navigate = useNavigate()

    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    })

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs)
            const data = response.data
            localStorage.setItem("token", `Bearer ${data.token}`)
            localStorage.setItem("name", data.name)
            navigate("/blogs")
        } catch (error) {
            alert(`Error while ${type === "signup" ? "signing up" : "loggin in"}`)
            //alert the user
        }

    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        {type === "signup" ? "Create an account" : "Login to your account"}
                    </div>
                    <div className="text-slate-500">
                        {type === "signup" ? "Already have an account?" : "Don't have an account?"}
                        <Link to={type === "signup" ? "/signin" : "/signup"} className="pl-2 underline">{type === "signup" ? "Login" : "Sign Up"}</Link>
                    </div>
                </div>
                <div className="pt-4">
                    {type === "signup" ? <LabelledInput label="Name" placeholder="Sarvesh Kulkarni...." onChange={(e) => {
                        setPostInputs(({
                            ...postInputs,
                            name: e.target.value
                        }))
                    }} /> : null}
                    <LabelledInput label="Email" placeholder="sarvesh@example.com" onChange={(e) => {
                        setPostInputs(({
                            ...postInputs,
                            email: e.target.value
                        }))
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="Enter your password" onChange={(e) => {
                        setPostInputs(({
                            ...postInputs,
                            password: e.target.value
                        }))
                    }} />
                    <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus: ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{type === "signup" ? "Sign Up" : "Sign In"}</button>
                </div>
            </div>
        </div>

    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm font-semibold text-black pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}