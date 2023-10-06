import Noggles from "public/logo-Noggles.svg";

const Footer = () => {
  return (
    <div className="bg-off-light dark:bg-off-dark py-5 flex justify-between items-center">
      <div className="container mx-auto flex flex-col 2xl:flex-row xl:flex-row lg:flex-row  justify-between 2xl:items-center xl:items-center lg:items-center md:items-center items-start gap-2 text-white xl:px-10 lg:px-10 md:px-5 sm:px-2 px-4">
        <div className="p-4 ">
          <a href="https://nouns.wtf/" target="_blank">
            <img src={Noggles.src} className="w-1/2" />
            <p className="font-Pix text-xs text-black dark:text-white hover:!text-primary">
              A NounsDAO Thing
            </p>
          </a>
        </div>

        <div className="text-black dark:text-white text-sm font-medium mx-auto ">
          <ul className="list-disc leading-7 mx-10">
            <li>
              <a href="/about">
                <p className="py-1 font-normal hover:underline hover:text-primary text-sm ">
                  About
                </p>
              </a>
            </li>
            <li>
              <a href="/guidelines">
                <p className="py-1 font-normal hover:underline hover:text-primary text-sm ">
                  Guidelines
                </p>
              </a>
            </li>
            <li>
              <a href="/artists">
                <p className="py-1 font-normal hover:underline hover:text-[#FF2165] text-sm ">
                  Artists
                </p>
              </a>
            </li>
          </ul>
        </div>

        <div className=" p-4 ">
          <p className="font-normal text-sm text-black dark:text-white ">
            Check out
          </p>
          <a href="https://studio.noundry.wtf/" target="_blank">
            <p className="font-Pix text-black dark:text-white py-1 hover:!text-primary text-xs">
              Noundry Studio
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
