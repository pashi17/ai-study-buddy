import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/landing");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        .intro-container {
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          position: relative;
          overflow: hidden;
          animation: slideUp 4s ease-in-out forwards;
          animation-delay: 0s;
        }

        @keyframes slideUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          85% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }

        .decorator {
          position: absolute;
          opacity: 0.1;
          pointer-events: none;
        }

        .decorator-1 {
          width: 300px;
          height: 300px;
          background: rgba(102, 126, 234, 0.3);
          border-radius: 50%;
          top: -100px;
          right: -100px;
          animation: floatDecorator 6s ease-in-out infinite;
        }

        .decorator-2 {
          width: 200px;
          height: 200px;
          background: rgba(244, 93, 112, 0.3);
          border-radius: 50%;
          bottom: -50px;
          left: -50px;
          animation: floatDecorator 8s ease-in-out infinite;
        }

        .intro-content {
          text-align: center;
          z-index: 10;
          animation: fadeInScale 1s ease-out;
        }

        .intro-logo {
          font-size: 80px;
          margin-bottom: 30px;
          animation: bounceIn 1.2s ease-out;
          display: inline-block;
        }

        .intro-content h1 {
          font-family: 'Poppins', sans-serif;
          font-size: 56px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 15px;
          line-height: 1.3;
          animation: slideInDown 0.8s ease-out 0.3s both;
        }

        .intro-content h1 .gradient-text {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .intro-content p {
          font-size: 18px;
          color: #b0b0b0;
          font-weight: 500;
          margin-bottom: 20px;
          animation: slideInUp 0.8s ease-out 0.5s both;
          letter-spacing: 1px;
        }

        .loading-dots {
          display: inline-block;
          animation: slideInUp 0.8s ease-out 0.7s both;
        }

        .dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0 6px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .progress-bar {
          position: absolute;
          bottom: 25px;
          left: 40%;
          transform: translateX(-50%);
          width: 300px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          overflow: hidden;
          animation: slideInUp 0.8s ease-out 0.9s both;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          animation: progressFill 4s ease-out forwards;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes floatDecorator {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .intro-content h1 {
            font-size: 36px;
          }

          .intro-content p {
            font-size: 16px;
          }

          .intro-logo {
            font-size: 60px;
          }

          .decorator-1 {
            width: 200px;
            height: 200px;
            top: -50px;
            right: -50px;
            background: rgba(102, 126, 234, 0.3);
          }

          .decorator-2 {
            width: 150px;
            height: 150px;
            background: rgba(244, 93, 112, 0.3);
          }
        }
      `}</style>

      <div className="intro-container">
        <div className="decorator decorator-1"></div>
        <div className="decorator decorator-2"></div>

        <div className="intro-content">
          <div className="intro-logo"><img src="src/assest/WhatsApp_Image_2026-03-09_at_12.55.11_PM-removebg-preview.png" alt="logo" />📚</div>
          <h1>
            Welcome to <span className="gradient-text">AI Study Buddy</span>
          </h1>
          <p>Your Smart Learning Companion</p>
          <p>Brother Ab Hoga Come-Back</p>
          
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </>
  );
}