import { useState } from "react";

// ─── Sample Data ────────────────────────────────────────────────────────────

const LOAN = {
  amount: 3000,
  currency: "MXN",
  lender: "Humand Préstamos",
  status: "Al día",
  paidPercent: 25,
  nextDueDate: "10 mar 2026",
  payments: [
    { week: 1, date: "03 mar 2026", amount: 810.92, status: "Pagado",    isCurrent: false },
    { week: 2, date: "10 mar 2026", amount: 810.92, status: "Pendiente", isCurrent: true  },
    { week: 3, date: "17 mar 2026", amount: 810.92, status: "Pendiente", isCurrent: false },
    { week: 4, date: "24 mar 2026", amount: 810.92, status: "Pendiente", isCurrent: false },
  ],
};

// ─── Status config ───────────────────────────────────────────────────────────

const STATUS_STYLE = {
  Aprobado:  { pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  Acreditado:{ pill: "bg-blue-100   text-blue-700",   dot: "bg-blue-500"   },
  "Al día":  { pill: "bg-green-100  text-green-700",  dot: "bg-green-500"  },
  "En mora": { pill: "bg-red-100    text-red-700",    dot: "bg-red-500"    },
};

// ─── Icons ───────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE["Al día"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${s.pill}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function BatteryBar({ paidPercent }) {
  const pendingPercent = 100 - paidPercent;
  return (
    <div className="flex items-center gap-1">
      {/* Main battery body */}
      <div className="relative flex-1 h-7 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        {/* Filled section */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5B4BE8] to-[#8B7FF5] transition-all duration-700 ease-out"
          style={{ width: `${paidPercent}%` }}
        />
        {/* Segment separators — 4 equal segments */}
        {[25, 50, 75].map((pos) => (
          <div
            key={pos}
            className="absolute inset-y-0 w-px bg-white/60"
            style={{ left: `${pos}%` }}
          />
        ))}
        {/* Percentage label centred inside bar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow">
            {paidPercent}%
          </span>
        </div>
      </div>
      {/* Battery nub */}
      <div className="w-2 h-3.5 bg-gray-300 rounded-r-sm flex-shrink-0" />
    </div>
  );
}

function PaymentStatus({ payment }) {
  if (payment.status === "Pagado") {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 font-medium text-xs">
        <CheckIcon />
        Pagado
      </span>
    );
  }
  if (payment.status === "Vencido") {
    return (
      <span className="inline-flex items-center gap-1 text-red-500 font-medium text-xs">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Vencido
      </span>
    );
  }
  if (payment.isCurrent) {
    return (
      <span className="inline-flex items-center gap-1 text-[#5B4BE8] font-semibold text-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B4BE8] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B4BE8]" />
        </span>
        Próxima
      </span>
    );
  }
  return <span className="text-gray-400 text-xs">Pendiente</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoanDashboard() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const { amount, currency, lender, status, paidPercent, nextDueDate, payments } = LOAN;
  const pendingPercent = 100 - paidPercent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-[420px] space-y-3">

        {/* ── 1. Credit Status Header ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md shadow-indigo-100 p-5">
          {/* Top row: status badge + logo placeholder */}
          <div className="flex items-center justify-between mb-4">
            <StatusBadge status={status} />
            <span className="text-xs text-gray-400 font-medium">{lender}</span>
          </div>

          {/* Loan amount */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
              ${amount.toLocaleString("es-MX")}
            </span>
            <span className="text-base font-medium text-gray-400">{currency}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Monto acreditado</p>

          {/* Decorative bottom accent */}
          <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#5B4BE8] to-[#8B7FF5]" />
        </div>

        {/* ── 2. Battery Progress Bar ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md shadow-indigo-100 p-5">
          {/* Legend */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5B4BE8]" />
              <span className="text-sm font-semibold text-[#5B4BE8]">Pagado: {paidPercent}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-400">Pendiente: {pendingPercent}%</span>
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            </div>
          </div>

          <BatteryBar paidPercent={paidPercent} />

          {/* Next due date */}
          <div className="mt-4 flex items-center gap-2 bg-indigo-50 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-[#5B4BE8] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-gray-800">Próximo vencimiento:</span>{" "}
              {nextDueDate}
            </p>
          </div>
        </div>

        {/* ── 3. Payment Schedule (collapsible) ───────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md shadow-indigo-100 overflow-hidden">
          {/* Toggle button */}
          <button
            onClick={() => setScheduleOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-800">
              Ver detalle —{" "}
              <span className="text-[#5B4BE8]">{payments.length} pagos semanales</span>
            </span>
            <ChevronIcon open={scheduleOpen} />
          </button>

          {/* Expandable table */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              scheduleOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-100">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Sem.</th>
                    <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Fecha</th>
                    <th className="text-right px-4 py-2.5 text-gray-500 font-semibold">Cuota total</th>
                    <th className="text-center px-4 py-2.5 text-gray-500 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr
                      key={p.week}
                      className={`border-t border-gray-50 transition-colors ${
                        p.isCurrent ? "bg-indigo-50/60" : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Week number with current indicator */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            p.isCurrent
                              ? "bg-[#5B4BE8] text-white"
                              : p.status === "Pagado"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {p.week}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.date}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        ${p.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <PaymentStatus payment={p} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Table footer — total */}
              <div className="border-t border-gray-100 px-4 py-3 flex justify-between items-center bg-gray-50">
                <span className="text-xs text-gray-500 font-medium">Total a pagar</span>
                <span className="text-sm font-extrabold text-gray-800">
                  ${(payments.reduce((s, p) => s + p.amount, 0)).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 pb-6">
          Pagos procesados cada lunes · {lender}
        </p>
      </div>
    </div>
  );
}
