
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

import {
  Dna,
  Activity, 
  Sparkles,
  LogOut,
} from "lucide-react";

const mutationOptions = [
  {
    value: "single nucleotide variant",
    label: "Single Nucleotide Variant",
  },
  { value: "Deletion", label: "Deletion" },
  { value: "Insertion", label: "Insertion" },
  { value: "Duplication", label: "Duplication" },
  { value: "Inversion", label: "Inversion" },
  { value: "copy number gain", label: "Copy Number Gain" },
  { value: "copy number loss", label: "Copy Number Loss" },
  { value: "Translocation", label: "Translocation" },
  { value: "Fusion", label: "Fusion" },
  { value: "Microsatellite", label: "Microsatellite" },
];
const geneOptions = [
  { value: "BRCA1", label: "BRCA1" },
  { value: "BRCA2", label: "BRCA2" },
  { value: "TP53", label: "TP53" },
  { value: "EGFR", label: "EGFR" },
  { value: "KRAS", label: "KRAS" },
  { value: "NRAS", label: "NRAS" },
  { value: "HRAS", label: "HRAS" },
  { value: "BRAF", label: "BRAF" },
  { value: "PIK3CA", label: "PIK3CA" },
  { value: "PTEN", label: "PTEN" },
  { value: "APC", label: "APC" },
  { value: "ALK", label: "ALK" },
  { value: "RET", label: "RET" },
  { value: "ROS1", label: "ROS1" },
  { value: "MET", label: "MET" },
  { value: "ERBB2", label: "ERBB2" },
  { value: "ERBB3", label: "ERBB3" },
  { value: "FGFR1", label: "FGFR1" },
  { value: "FGFR2", label: "FGFR2" },
  { value: "FGFR3", label: "FGFR3" },
  { value: "CDKN2A", label: "CDKN2A" },
  { value: "RB1", label: "RB1" },
  { value: "ATM", label: "ATM" },
  { value: "ATR", label: "ATR" },
  { value: "CHEK1", label: "CHEK1" },
  { value: "CHEK2", label: "CHEK2" },
  { value: "MLH1", label: "MLH1" },
  { value: "MSH2", label: "MSH2" },
  { value: "MSH6", label: "MSH6" },
  { value: "PMS2", label: "PMS2" },
  { value: "PALB2", label: "PALB2" },
  { value: "NTRK1", label: "NTRK1" },
  { value: "NTRK2", label: "NTRK2" },
  { value: "NTRK3", label: "NTRK3" },
  { value: "JAK2", label: "JAK2" },
  { value: "FLT3", label: "FLT3" },
  { value: "KIT", label: "KIT" },
  { value: "PDGFRA", label: "PDGFRA" },
  { value: "VHL", label: "VHL" },
  { value: "SMAD4", label: "SMAD4" },
  { value: "SMARCB1", label: "SMARCB1" },
  { value: "TSC1", label: "TSC1" },
  { value: "TSC2", label: "TSC2" },
  { value: "NF1", label: "NF1" },
  { value: "NF2", label: "NF2" },
  { value: "IDH1", label: "IDH1" },
  { value: "IDH2", label: "IDH2" },
  { value: "TERT", label: "TERT" },
  { value: "MYC", label: "MYC" },
  { value: "MYCN", label: "MYCN" },
  { value: "CCND1", label: "CCND1" },
  { value: "CDK4", label: "CDK4" },
  { value: "CDK6", label: "CDK6" },
  { value: "PTCH1", label: "PTCH1" },
  { value: "SUFU", label: "SUFU" },
  { value: "ARID1A", label: "ARID1A" },
  { value: "ARID1B", label: "ARID1B" },
  { value: "CTNNB1", label: "CTNNB1" },
  { value: "GNAQ", label: "GNAQ" },
  { value: "GNAS", label: "GNAS" }
];
const geneInfo = {
  BRCA1: {
    chromosome: "17",
    disease: "Breast & Ovarian Cancer",
  },
  BRCA2: {
    chromosome: "13",
    disease: "Breast, Ovarian & Prostate Cancer",
  },
  TP53: {
    chromosome: "17",
    disease: "Li-Fraumeni Syndrome",
  },
  EGFR: {
    chromosome: "7",
    disease: "Lung Cancer",
  },
  KRAS: {
    chromosome: "12",
    disease: "Colorectal & Pancreatic Cancer",
  },
  BRAF: {
    chromosome: "7",
    disease: "Melanoma",
  },
  PTEN: {
    chromosome: "10",
    disease: "Cowden Syndrome",
  },
  APC: {
    chromosome: "5",
    disease: "Familial Adenomatous Polyposis",
  },
  ALK: {
    chromosome: "2",
    disease: "Lung Cancer",
  },
  PIK3CA: {
    chromosome: "3",
    disease: "Breast Cancer",
  },
};

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [mutationType, setMutationType] = useState("");
  const [geneSymbol, setGeneSymbol] = useState("");

  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(null);

  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState(() => {
  const savedHistory = localStorage.getItem("predictionHistory");
  return savedHistory ? JSON.parse(savedHistory) : [];
});
useEffect(() => {
  localStorage.setItem(
    "predictionHistory",
    JSON.stringify(history)
  );
}, [history]);
const totalPredictions = history.length;

const pathogenicCount = history.filter(
  (item) => item.prediction === "Pathogenic"
).length;

const benignCount = history.filter(
  (item) => item.prediction === "Likely benign"
).length;

const uncertainCount = history.filter(
  (item) =>
    item.prediction === "Uncertain Significance"
).length;
const selectedGeneInfo = geneInfo[geneSymbol];
  const handleAuth = async () => {
    if (!username || !password) {
      Swal.fire({
  icon: "warning",
  title: "Missing Fields",
  text: "Please fill all fields",
  background: "#0f172a",
  color: "#fff",
});

      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post(
          "http://127.0.0.1:8000/login",
          {
            username,
            password,
          }
        );

        if (response.data.access_token) {
          localStorage.setItem(
            "token",
            response.data.access_token
          );

          setToken(response.data.access_token);

          Swal.fire({
  icon: "success",
  title: "Login Successful",
  text: "Welcome back!",
  background: "#0f172a",
  color: "white",
  confirmButtonColor: "#06b6d4",
});
        } else {
          alert(response.data.message);
        }
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/register",
          {
            username,
            password,
          }
        );

        Swal.fire({
  icon: "success",
  title: "Registration Successful",
  text: response.data.message,
  background: "#0f172a",
  color: "white",
  confirmButtonColor: "#06b6d4",
});

setIsLogin(true);
      }
    } catch (error) {
      Swal.fire({
  icon: "error",
  title: "Authentication Failed",
  text: "Invalid username or password",
  background: "#0f172a",
  color: "white",
  confirmButtonColor: "#ef4444",
});
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  const predictMutation = async () => {
    if (!mutationType || !geneSymbol) {
      Swal.fire({
  icon: "warning",
  title: "Missing Fields",
  text: "Please fill all fields",
  background: "#0f172a",
  color: "white",
  confirmButtonColor: "#eab308",
});
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          mutation_type: mutationType,
          gene_symbol: geneSymbol,
        }
      );

      setResult(response.data.prediction);

      setConfidence(response.data.confidence);

      setHistory((prev) => [
        {
          mutationType,
          geneSymbol,
          prediction: response.data.prediction,
          confidence: response.data.confidence,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (error) {
      Swal.fire({
  icon: "error",
  title: "Prediction Failed",
  text: "Please try again",
  background: "#0f172a",
  color: "white",
  confirmButtonColor: "#ef4444",
});
    }

    setLoading(false);
  };

  const downloadReport = async () => {
    const response = await axios.post(
      "http://127.0.0.1:8000/download-report",
      {
        mutation_type: mutationType,
        gene_symbol: geneSymbol,
      },
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "dna_mutation_report.pdf"
    );

    document.body.appendChild(link);

    link.click();
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-white shadow-2xl">

          <div className="text-center mb-8">

            <Dna
              size={60}
              className="mx-auto text-cyan-300 mb-4"
            />

            <h1 className="text-4xl font-bold">
              {isLogin ? "Login" : "Register"}
            </h1>

            <p className="text-slate-300 mt-2">
              DNA Mutation Classifier
            </p>

          </div>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 outline-none"
            />

            <button
              onClick={handleAuth}
              className="w-full bg-linear-to-r from-cyan-500 to-purple-500 p-4 rounded-2xl font-semibold"
            >
              {isLogin ? "Login" : "Register"}
            </button>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-cyan-300"
            >
              {isLogin
                ? "Create new account"
                : "Already have an account?"}
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-6 py-10 overflow-hidden text-white">
      
      <div className="relative w-full max-w-5xl bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[40px] p-6 md:p-14 transition-all duration-500 hover:shadow-cyan-500/20 hover:scale-[1.005]">

        <div className="flex justify-between items-start mb-10">

          <div className="w-full">

            <div className="w-full flex justify-center mb-6">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-cyan-400/20 flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Dna size={32} className="md:w-12 md:h-12 text-cyan-300" />
              </div>
            </div>

            <h1 className="text-3xl md:text-6xl font-extrabold text-center leading-tight bg-linear-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              DNA Mutation Classifier
            </h1>

            <p className="text-slate-300 text-sm md:text-lg mt-4 text-center">
              AI-powered genetic mutation analysis
            </p>

          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 p-3 rounded-xl"
          >
            <LogOut />
          </button>

        </div>

        <div className="space-y-6">

          <Select
  options={mutationOptions}
  onChange={(selectedOption) =>
    setMutationType(selectedOption.value)
  }
  placeholder="Select Mutation Type"
  className="text-black"
  styles={{
    control: (base, state) => ({
      ...base,
      background: "rgba(255,255,255,0.08)",
      border: state.isFocused
        ? "1px solid #22d3ee"
        : "1px solid rgba(255,255,255,0.15)",
      borderRadius: "24px",
      padding: "12px",
      minHeight: "72px",
      boxShadow: "none",
      backdropFilter: "blur(20px)",
      color: "white",
    }),

    singleValue: (base) => ({
      ...base,
      color: "white",
      fontSize: "18px",
      fontWeight: "500",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#cbd5e1",
      fontSize: "18px",
    }),

    menu: (base) => ({
      ...base,
      background: "#0f172a",
      borderRadius: "20px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.1)",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "#164e63"
        : "#0f172a",
      color: "white",
      padding: "18px",
      cursor: "pointer",
      fontSize: "16px",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "#22d3ee",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  }}
/>

          <Select
  options={geneOptions}
  onChange={(selectedOption) =>
    setGeneSymbol(selectedOption.value)
  }
  placeholder="Search Gene Symbol..."
  isSearchable
  className="text-black"
  styles={{
    control: (base, state) => ({
      ...base,
      background: "rgba(255,255,255,0.08)",
      border: state.isFocused
        ? "1px solid #22d3ee"
        : "1px solid rgba(255,255,255,0.15)",
      borderRadius: "24px",
      padding: "12px",
      minHeight: "72px",
      boxShadow: "none",
      backdropFilter: "blur(20px)",
      color: "white",
    }),

    singleValue: (base) => ({
      ...base,
      color: "white",
      fontSize: "18px",
      fontWeight: "500",
    }),

    placeholder: (base) => ({
      ...base,
      color: "#cbd5e1",
      fontSize: "18px",
    }),

    menu: (base) => ({
      ...base,
      background: "#0f172a",
      borderRadius: "20px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.1)",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "#164e63"
        : "#0f172a",
      color: "white",
      padding: "18px",
      cursor: "pointer",
      fontSize: "16px",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "#22d3ee",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  }}
/>

          <button
            onClick={predictMutation}
            className="w-full bg-linear-to-r from-cyan-400 to-purple-500 hover:scale-[1.02] hover:shadow-cyan-400/40 hover:shadow-2xl transition-all duration-300 p-4 md:p-6 rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-3 shadow-2xl"
          >
            <Activity size={22} />
            Predict Mutation
          </button>

        </div>

        {loading && (
  <div className="flex flex-col items-center justify-center mt-10">

    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

    <p className="mt-4 text-cyan-300 text-lg animate-pulse">
      Analyzing mutation...
     </p>

  </div>
)}

        {result && (
          <div className="mt-12 bg-white/10 border border-white/10 backdrop-blur-2xl p-10 rounded-[35px] text-center shadow-2xl">

            <Sparkles
              size={36}
              className="mx-auto text-cyan-300 mb-4"
            />

            <h2 className="text-2xl font-semibold mb-3">
              Prediction Result
            </h2>

            <p className="text-2xl md:text-4xl font-bold text-cyan-300">
              {result}
            </p>

            <p className="mt-4 text-lg">
              Confidence:
              <span className="text-cyan-300 font-bold ml-2">
                {confidence}%
              </span>
            </p>
            <div className="mt-4 flex justify-center">

  <span
    className={`px-4 py-2 rounded-full font-semibold text-sm ${
      confidence >= 80
        ? "bg-green-500/20 text-green-400 border border-green-400/30"
        : confidence >= 60
        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-300/30"
        : "bg-red-500/20 text-red-400 border border-red-400/30"
    }`}
  >
    {confidence >= 80
      ? "🟢 Very High Confidence"
      : confidence >= 60
      ? "🟡 Moderate Confidence"
      : "🔴 Low Confidence"}
  </span>

</div>

            <div className="w-full bg-white/10 rounded-full h-5 mt-6 overflow-hidden">
              <div
                className="h-5 rounded-full bg-linear-to-r from-cyan-400 to-purple-500"
                style={{ width: `${confidence}%` }}
              ></div>
            </div>

            <button
              onClick={downloadReport}
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 hover:shadow-cyan-400/40 hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
            >
              Download PDF Report
            </button>

          </div>
        )}
        {result && (
  <div className="mt-8 bg-white/10 border border-white/10 backdrop-blur-2xl p-8 rounded-[35px] shadow-2xl">

    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
      Mutation Details
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <p className="text-slate-400 text-sm mb-2">
          Mutation Type
        </p>

        <h3 className="text-xl font-bold text-cyan-300">
          {mutationType}
        </h3>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <p className="text-slate-400 text-sm mb-2">
          Gene Symbol
        </p>

        <h3 className="text-xl font-bold text-purple-300">
          {geneSymbol}
        </h3>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <p className="text-slate-400 text-sm mb-2">
          Risk Level
        </p>

        <h3
  className={`text-xl font-bold ${
    confidence > 70
      ? "text-red-400"
      : confidence > 40
      ? "text-yellow-300"
      : "text-green-400"
  }`}
>
  {confidence > 70
    ? "High"
    : confidence > 40
    ? "Medium"
    : "Low"}
</h3>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <p className="text-slate-400 text-sm mb-2">
          AI Summary
        </p>

        <h3 className="text-lg font-semibold text-green-300">
          {result === "Pathogenic"
            ? "Potentially harmful mutation detected."
            : result === "Likely benign"
            ? "Mutation appears mostly non-harmful."
            : "Further clinical review may be required."}
        </h3>
      </div>

    </div>
  </div>
)}
{result && (
  <div className="mt-8 bg-white/10 border border-white/10 backdrop-blur-2xl p-8 rounded-[35px] shadow-2xl">

    <h2 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
      Mutation Description
    </h2>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

      <p className="text-lg text-slate-200 leading-8">

        {mutationType === "single nucleotide variant" &&
          "A Single Nucleotide Variant (SNV) is a mutation where a single nucleotide in the DNA sequence is altered. These mutations may influence protein function and are commonly associated with inherited diseases and cancer research."}

        {mutationType === "Deletion" &&
          "Deletion mutations occur when one or more nucleotides are removed from the DNA sequence. Large deletions can significantly affect gene function and may lead to severe genetic disorders."}

        {mutationType === "Insertion" &&
          "Insertion mutations involve adding extra nucleotides into a DNA sequence. This can disrupt the reading frame of genes and potentially alter protein synthesis."}

        {mutationType === "Duplication" &&
          "Duplication mutations occur when sections of DNA are copied multiple times. These mutations can increase gene dosage and are linked with various genomic disorders."}

        {mutationType === "Inversion" &&
          "Inversion mutations happen when a DNA segment breaks off, flips, and reinserts in reverse orientation. This may disrupt normal gene expression and chromosomal stability."}

        {mutationType === "copy number gain" &&
          "Copy number gain refers to an increased number of copies of a particular DNA region. This can amplify gene activity and is frequently observed in cancers."}

        {mutationType === "copy number loss" &&
          "Copy number loss occurs when sections of DNA are missing, reducing gene expression and potentially causing genetic abnormalities."}

        {mutationType === "Translocation" &&
          "Translocation mutations occur when a chromosome segment moves to another chromosome. These are strongly associated with leukemia and other cancers."}

        {mutationType === "Fusion" &&
          "Fusion mutations happen when two separate genes combine to form a hybrid gene, often leading to abnormal protein activity."}

        {mutationType === "Microsatellite" &&
          "Microsatellite mutations involve repetitive DNA sequence instability and are commonly studied in colorectal and hereditary cancers."}

      </p>

    </div>
  </div>
)}
{history.length > 0 && (
  <div className="mt-8 grid md:grid-cols-4 gap-4">

    <div className="bg-white/10 border border-white/10 rounded-3xl p-6 text-center">
      <h3 className="text-slate-400 text-sm">
        Total Predictions
      </h3>
      <p className="text-3xl font-bold text-cyan-300 mt-2">
        {totalPredictions}
      </p>
    </div>

    <div className="bg-white/10 border border-white/10 rounded-3xl p-6 text-center">
      <h3 className="text-slate-400 text-sm">
        Pathogenic
      </h3>
      <p className="text-3xl font-bold text-red-400 mt-2">
        {pathogenicCount}
      </p>
    </div>

    <div className="bg-white/10 border border-white/10 rounded-3xl p-6 text-center">
      <h3 className="text-slate-400 text-sm">
        Likely Benign
      </h3>
      <p className="text-3xl font-bold text-green-400 mt-2">
        {benignCount}
      </p>
    </div>

    <div className="bg-white/10 border border-white/10 rounded-3xl p-6 text-center">
      <h3 className="text-slate-400 text-sm">
        Uncertain
      </h3>
      <p className="text-3xl font-bold text-yellow-300 mt-2">
        {uncertainCount}
      </p>
    </div>

  </div>
)}
{selectedGeneInfo && (
  <div className="mt-8 bg-white/10 border border-white/10 backdrop-blur-2xl p-8 rounded-[35px] shadow-2xl">

    <h2 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
      Gene Information
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <p className="text-slate-400 text-sm mb-2">
          Gene Symbol
        </p>

        <h3 className="text-xl font-bold text-cyan-300">
          {geneSymbol}
        </h3>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <p className="text-slate-400 text-sm mb-2">
          Chromosome
        </p>

        <h3 className="text-xl font-bold text-purple-300">
          {selectedGeneInfo.chromosome}
        </h3>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 md:col-span-2">
        <p className="text-slate-400 text-sm mb-2">
          Associated Disease
        </p>

        <h3 className="text-xl font-bold text-green-300">
          {selectedGeneInfo.disease}
        </h3>
      </div>

    </div>

  </div>
)}
        {history.length > 0 && (
          <div className="mt-8 bg-white/10 border border-white/10 p-6 rounded-3xl transition-all duration-300 hover:border-cyan-400/30 hover:shadow-cyan-500/10 hover:shadow-xl">
            <div className="flex justify-end mb-4">
  <button
    onClick={() => setHistory([])}
    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-semibold"
  >
    Clear History
  </button>
</div>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Prediction History
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="text-cyan-300 border-b border-white/10">
                    <th className="p-3">Mutation</th>
                    <th className="p-3">Gene</th>
                    <th className="p-3">Result</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5"
                    >
                      <td className="p-3">
                        {item.mutationType}
                      </td>

                      <td className="p-3">
                        {item.geneSymbol}
                      </td>

                      <td className="p-3">
                        {item.prediction}
                      </td>

                      <td className="p-3">
                        {item.confidence}%
                      </td>

                      <td className="p-3">
                        {item.time}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;