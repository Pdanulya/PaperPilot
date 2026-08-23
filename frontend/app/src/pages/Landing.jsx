import React from "react";
import {Upload,Sparkles,MessageSquare,GitCompare,ArrowRight,Search,FileText,FolderOpen} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#0B1B33]">

      {/* ================= NAVBAR ================= */}

      <nav className="h-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto h-full px-6 lg:px-10 flex items-center justify-between">

          <div
            className="text-2xl font-medium tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Paper<span className="text-[#E5BA73]">Pilot</span>
          </div>

          <div className="flex items-center gap-6">

            <button
              onClick={() => navigate("/login")}
              className="text-sm text-slate-500 hover:text-[#0B1B33] transition-colors"
            >
              Sign in
            </button>

            <button
              onClick={() => navigate("/register")}
              className="bg-[#0B1B33] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#162a4a] transition-colors"
            >
              Get Started
            </button>

          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}

      <section className="border-b border-slate-200 bg-white">

  <div className="max-w-7xl mx-auto px-6 lg:px-10">

    <div className="py-24 lg:py-32">

      {/* HERO CONTENT */}
      <div className="max-w-6xl">

        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#b8955b] mb-6">
          Your documents, understood.
        </p>

        <h1
          className="text-5xl sm:text-6xl lg:text-[82px] leading-[1.02] font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Documents into insights.
          <br />

          <span className="text-[#b8955b]">
            Explore everything that matters.
          </span>
        </h1>

        <p className="mt-8 text-lg lg:text-xl text-slate-500 leading-8 max-w-3xl">
          PaperPilot turns your documents into something you can
          actually work with - search, summarize, ask
          questions, and compare.
        </p>

        <div className="flex items-center gap-4 mt-9">

          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 bg-[#0B1B33] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#162a4a] transition-colors"
          >
            Start with your documents
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-sm font-medium text-slate-500 hover:text-[#0B1B33] transition-colors"
          >
            See how it works
          </button>

        </div>

      </div>

    </div>

  </div>

</section>


      {/* ================= HOW IT WORKS ================= */}

      <section id="how-it-works" className="py-24">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="grid lg:grid-cols-[280px_1fr] gap-16">

            {/* Section intro */}

            <div>

              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#b8955b] mb-4">
                How it works
              </p>

              <h2
                className="text-3xl lg:text-4xl font-medium leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                From file
                <br />
                to insight.
              </h2>

              <p className="text-sm text-slate-500 leading-6 mt-5">
                Everything happens inside one workspace, so you don't
                have to move between different tools.
              </p>

            </div>


            {/* Steps */}

            <div className="border-t border-slate-200">

              <WorkflowRow
                icon={<Upload />}
                title="Upload your documents"
                description="Add PDFs and other supported documents to your PaperPilot workspace. Content is extracted and prepared for analysis."
              />

              <WorkflowRow
                icon={<Search />}
                title="Find what matters"
                description="Search through a document using semantic search to find relevant sections even when the exact words aren't used."
              />

              <WorkflowRow
                icon={<Sparkles />}
                title="Understand the content"
                description="Generate a structured summary instead of reading through every page manually."
              />

              <WorkflowRow
                icon={<MessageSquare />}
                title="Ask questions"
                description="Have a conversation with your document and get answers based on its content."
              />

              <WorkflowRow
                icon={<GitCompare />}
                title="Connect documents"
                description="Select multiple documents and analyze them together to identify similarities, differences, and relationships."
                last
              />
            </div>
          </div>
        </div>
      </section>


      {/* ================= USE CASES ================= */}

      <section className="bg-white border-y border-slate-200">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">

          <div className="mb-14">

            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#b8955b] mb-3">
              Built for real work
            </p>

            <h2
              className="text-3xl sm:text-4xl font-medium"
              style={{ fontFamily: "var(--font-display)" }}
            >
              A place for documents you
              <br />
              actually need to understand.
            </h2>

          </div>


          <div className="grid md:grid-cols-3 gap-8">

            <UseCase
              icon={<FolderOpen />}
              title="Research"
              text="Keep research papers, literature reviews and reference material together and explore them without repeatedly opening individual files."
            />

            <UseCase
              icon={<FileText />}
              title="Study"
              text="Turn lecture notes, textbooks and academic material into searchable, summarized knowledge you can question."
            />

            <UseCase
              icon={<GitCompare />}
              title="Projects"
              text="Compare specifications, reports and project documents to quickly understand how different sources relate to each other."
            />

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="border border-slate-200 bg-white rounded-2xl px-8 py-14 lg:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

            <div>

              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#b8955b] mb-3">
                Start here
              </p>

              <h2
                className="text-3xl sm:text-4xl font-medium"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your documents have
                <br />
                more to say.
              </h2>

              <p className="text-sm text-slate-500 mt-4 max-w-lg">
                Upload a document and see what PaperPilot can help you
                uncover.
              </p>

            </div>


            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 bg-[#0B1B33] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#162a4a] transition-colors flex-shrink-0"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#0B1B33] text-white">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div
            className="text-xl font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Paper<span className="text-[#E5BA73]">Pilot</span>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 PaperPilot. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   WORKFLOW ROW
========================================================= */

function WorkflowRow({
  number,
  icon,
  title,
  description,
  last = false,
}) {
  return (
    <div
      className={`grid grid-cols-[55px_40px_1fr] gap-4 py-7 ${
        !last ? "border-b border-slate-200" : ""
      }`}
    >

      <span className="text-xs font-medium text-slate-400 pt-1">
        {number}
      </span>

      <div className="w-9 h-9 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#0B1B33]">
        {React.cloneElement(icon, {
          className: "w-4 h-4",
        })}
      </div>

      <div>

        <h3 className="text-base font-semibold">
          {title}
        </h3>

        <p className="text-sm text-slate-500 leading-6 mt-1 max-w-xl">
          {description}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   USE CASE
========================================================= */

function UseCase({ icon, title, text }) {
  return (
    <div className="pr-8">

      <div className="w-10 h-10 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#0B1B33] mb-5">

        {React.cloneElement(icon, {
          className: "w-4 h-4",
        })}

      </div>

      <h3 className="text-base font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 leading-6">
        {text}
      </p>

    </div>
  );
}