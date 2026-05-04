import Appbar from "@/components/Appbar";
import { PrimaryButton } from "@/components/primaryButton";

export default function Home() {
  return (
    <div className="w-full">
      <main className="w-full">
        <div className="w-full bg-green-300 flex justify-evenly my-8">
          <div className="w-[30%] bg-red-300 flex justify-center items-center">
            <h6>Cyber Sky</h6>
          </div>
          <div className="w-[40%]">
            <Appbar></Appbar>
          </div>
          <div className="bg-green-800 w-[30%] flex justify-center items-center gap-5">
            <button>Language</button>
            <button>Login</button>
            <button>Sign Up</button>
          </div>
        </div>
        <div className="bg-yellow-200 flex flex-col justify-center items-center">
          <h1 className="text-6xl text-center">
            Secure Everything,
            <br />
            Compromise Nothing.
          </h1>
          <br />
          <p className="text-center">
            Secure your code, cloud, and runtime in one central system.
            <br />
            Find and fix vulnerabilities automatically
          </p>
        </div>
        <div className="bg-blue-200 items-center justify-center flex flex-col">
            <div className="flex justify-center items-center gap-4">
              <button>Start for Free</button>
              <button>Book a Demo</button>
            </div>
            <p>Free Open Source Alternative For Akido Securities</p>
        </div>
        <div className="bg-blue-300 flex justify-center items-center h-24 gap-8">
          <PrimaryButton label="cyber /code"></PrimaryButton>
          <PrimaryButton label="cyber /cloud"></PrimaryButton>
          <PrimaryButton label="cyber /attack"></PrimaryButton>
          <PrimaryButton label="cyber /protect"></PrimaryButton>
        </div>
      </main>
    </div>
  );
}
