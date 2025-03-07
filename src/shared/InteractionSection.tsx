import React, { useState, useEffect, useRef } from "react";
import useSpeechRecognitionHook from "./UseSpeechRecognitionHook";

interface InteractionSectionProps {
  setReceivedData: (data: string) => void;
  selectedVersion: string; // Selected version passed from HomePage
  setSelectedVersion: (version: string) => void; // Function to update selected version
}

const book_versions = [
  "AKJV_bible",
  "ASV_bible",
  "BRG_bible",
  "EHV_bible",
  "ESV_bible",
  "ESVUK_bible",
  "GNV_bible",
  "GW_bible",
  "ISV_bible",
  "JUB_bible",
  "KJ21_bible",
  "KJV_bible",
  "LEB_bible",
  "MEV_bible",
  "NASB_bible",
  "NASB1995_bible",
  "NET_bible",
  "NIV_bible",
  "NIVUK_bible",
  "NKJV_bible",
  "NLT_bible",
  "NLV_bible",
  "NOG_bible",
  "NRSV_bible",
  "NRSVUE_bible",
  "WEB_bible",
  "YLT_bible",
];

const InteractionSection: React.FC<InteractionSectionProps> = ({
  setReceivedData,
  selectedVersion,
  setSelectedVersion,
}) => {
  const [listening, setListening] = useState(false);
  const [icon, setIcon] = useState("/assets/play.png");
  const [buttonText, setButtonText] = useState("Start Listening");
  const [buttonColor, setButtonColor] = useState("btn-black");
  const [buttonIcon, setButtonIcon] = useState("/assets/mic.png");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // State for profile menu visibility
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null); // Ref for profile menu

  // use speech recognition
  const {
    isListening,
    receivedData,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognitionHook(selectedVersion); // Pass selectedVersion to the hook

  const handleButtonClick = () => {
    if (!listening) {
      setListening(true);
      setIcon("/assets/vector.png");
      setButtonText("Stop Listening");
      setButtonColor("btn-red");
      setButtonIcon("/assets/mic-off.png");
      startListening();
    } else {
      setListening(false);
      setIcon("/assets/pause.png");
      setButtonText("Continue Listening");
      setButtonColor("btn-black");
      setButtonIcon("/assets/mic.png");
      stopListening();
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version); // Update the selected version in the parent component
    setDropdownVisible(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    // Hide dropdown if clicked outside
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownVisible(false);
    }

    // Hide profile menu if clicked outside
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    if (receivedData) {
      setReceivedData(receivedData);
    }
  }, [receivedData, setReceivedData]);

  useEffect(() => {
    // Add event listener for outside clicks
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {hasRecognitionSupport ? (
        <section className="bg-white px-20 py-6 xl:w-1/2 relative w-full rounded-xl">
          {/* Profile Menu */}
          {showProfileMenu && (
            <div
              ref={profileMenuRef}
              className="bg-slate-500/20 sm:hidden absolute right-1 w-fit -top-[21em] rounded-lg p-2"
            >
              <ul className="space-y-5">
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
                  <img
                    src="/assets/setting.png"
                    alt="Settings"
                    className="w-5 sm:w-5"
                  />
                  <span className="bg-slate-400/10">Settings</span>
                </li>
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
                  <img
                    src="/assets/help.png"
                    alt="Get Help"
                    className="w-5 sm:w-5"
                  />
                  <span className="bg-slate-400/10">Get Help</span>
                </li>
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
                  <img
                    src="/assets/about.png"
                    alt="About"
                    className="w-5 sm:w-5"
                  />
                  <span className="bg-slate-400/10">About</span>
                </li>
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
                  <img
                    src="/assets/setting.png"
                    alt="Change Password"
                    className="w-5 sm:w-5"
                  />
                  <span className="bg-slate-400/10">Change Password</span>
                </li>
                <li className="hover:bg-white/20 pl-2 rounded-lg font-bold text-lg flex items-center gap-2">
                  <img
                    src="/assets/out.png"
                    alt="Sign Out"
                    className="w-5 sm:w-5"
                  />
                  <span className="bg-slate-400/10">Sign Out</span>
                </li>
              </ul>
            </div>
          )}

          {/* Profile Button */}
          {!receivedData && (
            <div>
              <button
                className="profile-button absolute sm:hidden sm:static bg-slate-400/30 rounded-2xl sm:mr-2 right-2 sm:left-10 -top-20 sm:top-8 font-bold text-lg flex items-center hover:cursor-pointer transition-all"
                onClick={() => setShowProfileMenu(!showProfileMenu)} // Toggle profile menu
              >
                <img
                  src="/assets/profile.png"
                  alt="Bible Version"
                  className="w-8 sm:w-14 p-1 sm:p-3 bg-white/30 rounded-full ml-1 sm:-ml-2"
                />
                <span className="p-3">profile</span>
              </button>
            </div>
          )}

          {/* Rest of the code remains unchanged */}
          {!receivedData && (
            <div className="absolute sm:hidden sm:static left-2 sm:ml-2 sm:left-10 -top-20 sm:top-8 font-bold text-lg flex items-center sm:gap-2">
              <img
                src="/assets/version.png"
                alt="Bible Version"
                className="w-8 sm:w-14"
              />
              <span className="bg-slate-400/10 p-3">
                {selectedVersion || "Bible version"}
              </span>
            </div>
          )}
          <img
            title="Bible Versions"
            src="/assets/dots.png"
            alt="three dots"
            className="absolute right-0 w-9 cursor-pointer"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <ul
              ref={dropdownRef}
              className="absolute right-3 xl:right-0 -top-45 xl:top-15 mt-2 w-48 h-[10em] overflow-y-scroll bg-white border border-gray-300 rounded shadow-lg"
            >
              <p className="text-center p-2 font-bold underline">
                Bible Versions
              </p>
              {book_versions.map((version) => (
                <li
                  key={version}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleVersionChange(version)}
                >
                  {version}
                </li>
              ))}
            </ul>
          )}
          <ul className="flex flex-col items-center space-y-5">
            <li
              className={`span-color p-3 w-fit min-h-[50px] ${
                listening ? "pt-4 shadow-gradient" : ""
              } rounded-full`}
            >
              <span className="">
                <img src={icon} alt="" />
              </span>
            </li>
            <li className="w-[214px] text-center font-semibold">
              Transcribing and detecting Bible quotations in real time
            </li>
            <li className="">
              <button
                className={`w-[197px] h-[48px] ${buttonColor} text-white flex justify-center hover:scale-105 transition-all hover:cursor-pointer rounded-3xl p-3 space-x-2 font-semibold ${
                  buttonText === "Start Listening" ||
                  buttonText === "Continue Listening"
                    ? "bouncing-button"
                    : ""
                }`}
                onClick={handleButtonClick}
              >
                <img src={buttonIcon} alt="mic" /> <span>{buttonText}</span>
              </button>
            </li>
          </ul>
        </section>
      ) : (
        <div>Your Browser doesn't have recognition support</div>
      )}
    </>
  );
};

export default InteractionSection;