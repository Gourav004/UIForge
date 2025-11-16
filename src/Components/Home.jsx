import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import Select from "react-select";
import Editor from "@monaco-editor/react";
import { GoogleGenAI } from "@google/genai";
import { PacmanLoader } from "react-spinners";
import toast from "react-hot-toast";

const Home = () => {
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(2);
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setNewTabOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  ];

  const [framework, setFramework] = useState(options[0]);
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyAZvr1v-LxiIz2dwQiWgz_06dty_mV-FiY",
  });

  function extractCode(response) {
    // Regex se triple backticks ke andar ka content nikalta hai
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const handleRefreshClick = () => {
    setIsRotating(true);

    // rotation complete hone ke baad reset (1 second = same as CSS duration)
    setTimeout(() => {
      setIsRotating(false);
    }, 1000);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true); // Immediately true
      toast.success("Copied to Clipboard");

      setTimeout(() => {
        setCopied(false); // 2 seconds baad false
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const fileName = "UIForge-Code.html"; // 1. Download hone wali file ka naam set kar diya
    const blob = new Blob([code], {
      // 2. User ke code ko ek "Blob" (binary large object) me convert kiya
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob); // 3. Browser se ek temporary URL banaya (blob ko represent karta hai)
    const link = document.createElement("a"); // 4. Ek <a> tag dynamically create kiya
    link.href = url; // 5. <a> tag ka href blob URL pe set kar diya
    link.download = fileName; // 6. <a> ke download attribute me file ka naam diya
    link.click(); // 7. Click simulate kiya → browser download start kar deta hai
    URL.revokeObjectURL(url); // 8. Memory free kar di — blob URL ko browser se remove kar diya
    toast.success("File Downloaded");
  };

  async function getResponse() {
    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: ` You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${framework.value}  

Requirements:  
The code must be clean, well-structured, and easy to understand.  
Optimize for SEO where applicable.  
Focus on creating a modern, animated, and responsive UI design.  
Include high-quality hover effects, shadows, animations, colors, and typography.  
Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
Do NOT include explanations, text, comments, or anything else besides the code.  
And give the whole code in a single HTML file.
`,
      });
      console.log(response.text);
      setOutputScreen(true);
      setCode(extractCode(response.text));
      setLoading(false);
    } catch (error) {
      toast.error("Try again after sometime");
    }
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "black",
      borderColor: "#333",
      padding: "4px",
      borderRadius: "10px",
      boxShadow: "none",
      color: "#fff",
      ":hover": {
        borderColor: "#555",
      },
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1a1a1a",
      borderRadius: "10px",
      padding: "6px",
      color: "#fff",
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#0099cc" : "#1a1a1a",
      color: "#fff",
      borderRadius: "6px",
      cursor: "pointer",
      ":active": {
        backgroundColor: "#444",
      },
    }),

    input: (provided) => ({
      ...provided,
      color: "#fff",
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#aaa",
    }),
  };

  return (
    <div>
      <Navbar />
      <div className="main flex items-center px-[100px] justify-between gap-[20px] text-white">
        <div className="left w-[50%] h-[80vh] bg-zinc-900 rounded-xl">
          <h3 className="text-2xl font-semibold text-[#ab30f3] flex flex-row gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-sparkles-icon lucide-sparkles"
            >
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              <path d="M20 2v4" />
              <path d="M22 4h-4" />
              <circle cx="4" cy="20" r="2" />
            </svg>{" "}
            AI Component Generator
          </h3>
          <p className="describe">Choose Framework</p>
          <Select
            options={options}
            styles={customStyles}
            onChange={(e) => setFramework(e.value)}
          />
          <p className="describe">Describe your component</p>
          <textarea
            class="my-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your component"
          ></textarea>
          <div class="btn-box">
            <button
              onClick={getResponse}
              class={`generate loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className={`lucide lucide-wand-sparkles-icon lucide-wand-sparkles `}
              >
                <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
                <path d="m14 7 3 3" />
                <path d="M5 6v4" />
                <path d="M19 14v4" />
                <path d="M10 2v2" />
                <path d="M7 8H3" />
                <path d="M21 16h-4" />
                <path d="M11 3H9" />
              </svg>
              Generate
            </button>
          </div>
        </div>
        <div
          className="right relative w-[50%] h-[80vh] bg-zinc-900 rounded-xl"
          style={{ overflow: "visible", position: "relative" }}
        >
          {outputScreen === false ? (
            <>
              {/* --- LOADER STYLING CHANGED --- */}
              {loading ? (
                <div className=" text-white loader w-full h-full flex flex-col items-center justify-center gap-4">
                  <PacmanLoader color="#9b14e9" />
                  <p className="text-gray-400 text-lg">
                    Generating your component...
                  </p>
                </div>
              ) : (
                <div className="skeleton h-[100%] flex justify-center items-center flex-col gap-3">
                  <h1 className="code-icon h-16 w-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex justify-center items-center rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-code"
                    >
                      <path d="m16 18 6-6-6-6" />
                      <path d="m8 6-6 6 6 6" />
                    </svg>
                  </h1>
                  <p className="sket-text text-gray-500">
                    Your component & code will appear here.
                  </p>
                </div>
              )}
              {/* --- END OF LOADER CHANGE --- */}
            </>
          ) : (
            <div
              style={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "5px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => setTab(1)}
                  className={`btn w-[50%] rounded-xl cursor-pointer transition-all ${
                    tab === 1 ? "bg-[#9b14e9]" : ""
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`btn w-[50%] rounded-xl cursor-pointer transition-all ${
                    tab === 2 ? "bg-[#9b14e9]" : ""
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className=" top-2 flex justify-between font-light items-center w-full px-4 py-4 bg-[#0f0f0f]">
                {tab === 1 ? (
                  <h5 className="font-semibold">Code Editor</h5>
                ) : (
                  <h5 className="font-semibold">Preview</h5>
                )}

                <div className="flex flex-row gap-5 items-center">
                  {tab === 1 ? (
                    <>
                      <span onClick={copyText} className="cursor-pointer">
                        {copied === false ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              width="14"
                              height="14"
                              x="8"
                              y="8"
                              rx="2"
                              ry="2"
                            />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </span>

                      <span className="cursor-pointer" onClick={downloadFile}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 15V3" />
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <path d="m7 10 5 5 5-5" />
                        </svg>
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        onClick={() => setNewTabOpen(true)}
                        className="cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 3h6v6" />
                          <path d="M10 14 21 3" />
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        </svg>
                      </span>

                      <span
                        onClick={handleRefreshClick}
                        className="cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transform transition-transform duration-1000 ${
                            isRotating ? "rotate-[360deg]" : ""
                          }`}
                        >
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                        </svg>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Editor wrapper MUST have height */}
              {tab === 1 ? (
                <div style={{ flex: 1, overflow: "visible" }}>
                  <Editor
                    height="100%"
                    value={code}
                    width="100%"
                    theme="vs-dark"
                    defaultLanguage="html"
                    defaultValue="// Code here"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                    }}
                  />
                </div>
              ) : (
                <iframe
                  srcDoc={code}
                  className="preview bg-white text-black w-full h-full flex items-center justify-center"
                ></iframe>
              )}
            </div>
          )}
        </div>
      </div>
      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          {/* Close Button */}
          <button
            onClick={() => setNewTabOpen(false)}
            className="close absolute top-3 right-8 bg-red-600 text-white py-1 px-3 rounded-md text-sm hover:bg-red-500 cursor-pointer transition"
          >
            Close
          </button>

          {/* iFrame Preview */}
          <iframe srcDoc={code} className="w-full h-full mt-10"></iframe>
        </div>
      )}
    </div>
  );
};

export default Home;
