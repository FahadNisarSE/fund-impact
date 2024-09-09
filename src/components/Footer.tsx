import { BiSupport } from "react-icons/bi";
import { FaRegCopyright } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPinterest } from "react-icons/fa";

import { borel } from "@/app/layout";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="grid grid-cols-12 gap-[56px] max-w-screen-xl mx-auto mb-16">
      <section className="bg-[#061621] grid grid-cols-2 col-span-8 rounded-3xl overflow-hidden">
        <div className="flex flex-col gap-6 p-10 justify-around">
          <div className="border-l-2 pl-4 border-white">
            <h6 className={`${borel.className} text-primary pt-2 text-lg`}>
              Start here
            </h6>
          </div>
          <h3 className="text-white text-3xl font-semibold text-balance">
            Buil the next <br /> big thing
          </h3>
          <p className="text-[#b8c4c2] text-balance">
            Realize the ideas of tommorow faster than ever.
          </p>
          <Button>Start Free</Button>
        </div>
        <div>
          <img
            src="/footer_vector.svg"
            alt="footer vector"
            className="w-full h-full object-contain"
          />
        </div>
      </section>
      <section className="col-span-4 p-10 flex flex-col rounded-3xl border">
        <div className="border-l-2 pl-4 border-primary">
          <h3 className={`${borel.className} text-lg pt-2`}>More information</h3>
        </div>

        <ul className="flex flex-col gap-6 mt-10 flex-1">
          <li className="flex flex-row gap-2">
            <BiSupport className="min-w-5 min-h-5 text-primary" />{" "}
            <p className="mt-0 leading-tight">fundimpact@mail.com</p>
          </li>
          <li className="flex flex-row gap-2">
            <FaRegCopyright className="min-w-5 min-h-5 text-primary" />
            <p className="mt-0 leading-tight">Fund Impact Official 2024</p>
          </li>
          <li className="flex flex-row items-center gap-4 mt-auto">
            <FaFacebookF className="min-w-6 min-h-6 text-primary" />
            <FaXTwitter className="min-w-6 min-h-6 text-primary" />
            <FaPinterest className="min-w-6 min-h-6 text-primary" />
          </li>
        </ul>
      </section>
    </footer>
  );
}
