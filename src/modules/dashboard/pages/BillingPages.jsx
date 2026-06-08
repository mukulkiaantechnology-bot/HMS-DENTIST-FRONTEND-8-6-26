import { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Download,
  FileText,
  CreditCard,
  ShieldCheck,
  Receipt,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useBillingStore } from '../../../store/billingStore';
import { usePatientStore } from '../../../store/patientStore';
import { DataTable } from '../../../shared/ui/DataTable';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import { Modal } from '../../../shared/ui/Modal';

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function InvoiceStatusBadge({ status }) {
  const map = {
    Paid: 'success',
    Partial: 'warning',
    Unpaid: 'info',
    Overdue: 'destructive',
    Pending: 'warning',
    Approved: 'success',
    Rejected: 'destructive'
  };
  return <Badge variant={map[status] || 'secondary'} className="font-bold text-[9px] uppercase">{status}</Badge>;
}

// ─── CSV UTIL ────────────────────────────────────────────────────────────────
function downloadCSV(filename, rows, headers) {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h] ?? '')).join(','))
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── REVENUE TREND DATA ───────────────────────────────────────────────────────
const MONTHLY_TREND = [
  { month: 'Jan', revenue: 4200, insurance: 2800, patient: 1400 },
  { month: 'Feb', revenue: 5800, insurance: 3900, patient: 1900 },
  { month: 'Mar', revenue: 4900, insurance: 3100, patient: 1800 },
  { month: 'Apr', revenue: 6700, insurance: 4200, patient: 2500 },
  { month: 'May', revenue: 7380, insurance: 4600, patient: 2780 },
  { month: 'Jun', revenue: 5240, insurance: 3200, patient: 2040 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// 1. BILLING DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════════════════════
export function BillingDashboardTab() {
  const { invoices, payments, claims } = useBillingStore();

  const todayStr = new Date().toISOString().split('T')[0];

  const todayRevenue = useMemo(() =>
    payments.filter((p) => p.date === todayStr).reduce((s, p) => s + p.amount, 0),
    [payments, todayStr]
  );

  const pendingInvoices = useMemo(() =>
    invoices.filter((inv) => inv.status === 'Unpaid' || inv.status === 'Partial').length,
    [invoices]
  );

  const overdueInvoices = useMemo(() =>
    invoices.filter((inv) => inv.status === 'Overdue'),
    [invoices]
  );

  const pendingClaims = useMemo(() =>
    claims.filter((c) => c.status === 'Pending').length,
    [claims]
  );

  const monthRevenue = useMemo(() => {
    const prefix = todayStr.slice(0, 7);
    return payments.filter((p) => p.date.startsWith(prefix)).reduce((s, p) => s + p.amount, 0);
  }, [payments, todayStr]);

  const recentTx = useMemo(() => [...payments].slice(0, 6), [payments]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overdue Alert */}
      {overdueInvoices.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <AlertCircle className="h-4.5 w-4.5 text-rose-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-extrabold text-rose-500">Overdue Invoice Alert</p>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
              {overdueInvoices.length} invoice{overdueInvoices.length > 1 ? 's' : ''} overdue — {overdueInvoices.map((i) => i.patientName).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: `$${todayRevenue.toFixed(2)}`, icon: DollarSign, color: 'primary', sub: 'Collected today' },
          { label: 'Pending Invoices', value: pendingInvoices, icon: Clock, color: 'amber', sub: 'Awaiting payment' },
          { label: 'Claims Pending', value: pendingClaims, icon: ShieldCheck, color: 'indigo', sub: 'Insurance review' },
          { label: 'Monthly Revenue', value: `$${monthRevenue.toFixed(2)}`, icon: TrendingUp, color: 'emerald', sub: 'This month' }
        ].map((kpi) => {
          const Icon = kpi.icon;
          const colorMap = {
            primary: 'bg-primary/10 text-primary',
            amber: 'bg-amber-500/10 text-amber-500',
            indigo: 'bg-indigo-500/10 text-indigo-500',
            emerald: 'bg-emerald-500/10 text-emerald-500'
          };
          return (
            <div key={kpi.label} className="bg-card border border-border p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{kpi.label}</span>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1">{kpi.value}</h3>
                </div>
                <div className={`p-2.5 rounded-xl ${colorMap[kpi.color]}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground font-semibold mt-3">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-extrabold text-sm text-foreground mb-4">Monthly Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_TREND} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 9, fontWeight: 700 }} />
              <Tooltip
                contentStyle={{ fontSize: 11, fontWeight: 700, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)' }}
                formatter={(v) => [`$${v}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
              <Bar dataKey="insurance" name="Insurance" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="patient" name="Patient" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-extrabold text-sm text-foreground">Recent Payments</h3>
          {recentTx.length === 0 ? (
            <p className="text-xs text-muted-foreground">No payments recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <div>
                    <p className="text-xs font-extrabold text-foreground">{tx.patientName}</p>
                    <p className="text-[9px] text-muted-foreground font-semibold">{tx.method} · {tx.date}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-500">+${tx.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. INVOICES TAB
// ═══════════════════════════════════════════════════════════════════════════════
export function BillingInvoicesTab() {
  const { invoices, createInvoice, updateInvoice, deleteInvoice } = useBillingStore();
  const { patients } = usePatientStore();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingInv, setEditingInv] = useState(null);

  // Form state
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taxPct, setTaxPct] = useState('5');
  const [discountAmt, setDiscountAmt] = useState('0');
  const [status, setStatus] = useState('Unpaid');
  const [items, setItems] = useState([{ description: '', cost: '' }]);

  const resetForm = () => {
    setEditingInv(null);
    setPatientId(patients[0]?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setTaxPct('5');
    setDiscountAmt('0');
    setStatus('Unpaid');
    setItems([{ description: '', cost: '' }]);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (inv) => {
    setEditingInv(inv);
    const pat = patients.find((p) => p.name === inv.patientName);
    setPatientId(pat?.id || '');
    setDate(inv.date);
    setDueDate(inv.dueDate || '');
    setTaxPct(String(inv.tax ? ((inv.tax / inv.amount) * 100).toFixed(0) : 5));
    setDiscountAmt(String(inv.discount || 0));
    setStatus(inv.status);
    setItems(inv.items && inv.items.length > 0 ? inv.items.map((i) => ({ ...i, cost: String(i.cost) })) : [{ description: '', cost: '' }]);
    setIsOpen(true);
  };

  const subtotal = useMemo(() => items.reduce((s, i) => s + (parseFloat(i.cost) || 0), 0), [items]);
  const taxAmount = useMemo(() => (subtotal * (parseFloat(taxPct) || 0)) / 100, [subtotal, taxPct]);
  const total = useMemo(() => Math.max(0, subtotal + taxAmount - (parseFloat(discountAmt) || 0)), [subtotal, taxAmount, discountAmt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) { toast.error('Please select a valid patient.'); return; }
    if (items.some((i) => !i.description || !i.cost)) { toast.error('All line items require a description and cost.'); return; }

    const payload = {
      patientId,
      patientName: patient.name,
      clinicId: patient.clinicId || 'clinic-1',
      date,
      dueDate,
      amount: total,
      tax: taxAmount,
      discount: parseFloat(discountAmt) || 0,
      status,
      items: items.map((i) => ({ description: i.description, cost: parseFloat(i.cost) || 0 }))
    };

    if (editingInv) {
      updateInvoice(editingInv.id, payload);
      toast.success(`Invoice ${editingInv.id} updated successfully.`);
    } else {
      createInvoice(payload);
      toast.success(`Invoice created for ${patient.name} — $${total.toFixed(2)}`);
    }
    setIsOpen(false);
  };

  const handleDelete = (inv) => {
    if (window.confirm(`Delete invoice ${inv.id} for ${inv.patientName}?`)) {
      deleteInvoice(inv.id);
      toast.warning(`Invoice ${inv.id} deleted.`);
    }
  };

  const handleDownloadCSV = () => {
    const rows = invoices.map((inv) => ({
      'Invoice ID': inv.id,
      'Patient': inv.patientName,
      'Date': inv.date,
      'Due Date': inv.dueDate || '',
      'Amount': inv.amount.toFixed(2),
      'Tax': inv.tax?.toFixed(2) || '0.00',
      'Discount': inv.discount?.toFixed(2) || '0.00',
      'Insurance Paid': inv.insurancePaid?.toFixed(2) || '0.00',
      'Patient Paid': inv.patientPaid?.toFixed(2) || '0.00',
      'Status': inv.status
    }));
    downloadCSV('invoices.csv', rows, Object.keys(rows[0]));
    toast.success('Invoices exported as CSV.');
  };

  const columns = [
    { key: 'id', header: 'Invoice ID', render: (inv) => <span className="font-bold text-slate-500 text-[11px]">#{inv.id}</span> },
    { key: 'patientName', header: 'Patient', render: (inv) => <span className="font-extrabold text-foreground text-xs">{inv.patientName}</span> },
    { key: 'date', header: 'Date', render: (inv) => <span className="text-xs font-medium text-muted-foreground">{inv.date}</span> },
    { key: 'dueDate', header: 'Due Date', render: (inv) => <span className="text-xs font-medium text-muted-foreground">{inv.dueDate || '—'}</span> },
    { key: 'amount', header: 'Total', render: (inv) => <span className="font-extrabold text-foreground text-xs">${inv.amount.toFixed(2)}</span> },
    {
      key: 'balance',
      header: 'Balance Due',
      render: (inv) => {
        const bal = inv.amount - (inv.patientPaid || 0) - (inv.insurancePaid || 0);
        return <span className={`font-extrabold text-xs ${bal > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>${Math.max(0, bal).toFixed(2)}</span>;
      }
    },
    { key: 'status', header: 'Status', render: (inv) => <InvoiceStatusBadge status={inv.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (inv) => (
        <div className="flex gap-1.5 justify-end">
          <Button size="xs" variant="outline" onClick={() => handleOpenEdit(inv)} className="h-7 gap-1 font-bold text-[9px] text-primary border-primary/20 hover:bg-primary/10">
            <Edit2 className="h-3 w-3" /> Edit
          </Button>
          <Button size="xs" variant="outline" onClick={() => handleDelete(inv)} className="h-7 gap-1 font-bold text-[9px] text-rose-500 border-rose-500/20 hover:bg-rose-500/10">
            <Trash2 className="h-3 w-3" /> Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Invoices</h2>
          <p className="text-xs text-muted-foreground font-semibold">Create, manage, and track patient invoices with line-item breakdown.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDownloadCSV} className="font-bold text-xs gap-1.5 h-9">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button size="sm" onClick={handleOpenCreate} className="font-bold text-xs gap-1.5 h-9">
            <Plus className="h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
        <DataTable columns={columns} data={invoices} searchKey="patientName" searchPlaceholder="Search invoices by patient..." pageSize={10} />
      </div>

      {/* Create / Edit Invoice Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingInv ? `Edit Invoice — ${editingInv.id}` : 'Create New Patient Invoice'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Patient *</label>
              <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2.5 focus:outline-none cursor-pointer text-foreground">
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Invoice Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2.5 focus:outline-none cursor-pointer text-foreground">
                {['Unpaid', 'Partial', 'Paid', 'Overdue'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Invoice Date *" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="text-xs font-medium text-foreground" />
            <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="text-xs font-medium text-foreground" />
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Line Items *</label>
              <Button type="button" size="xs" variant="outline" onClick={() => setItems([...items, { description: '', cost: '' }])} className="h-6 text-[9px] font-bold gap-0.5">
                <Plus className="h-2.5 w-2.5" /> Add Row
              </Button>
            </div>
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
                <input
                  type="text"
                  placeholder="Procedure / Service description"
                  value={item.description}
                  onChange={(e) => { const n = [...items]; n[idx].description = e.target.value; setItems(n); }}
                  className="text-xs font-medium bg-muted border border-border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
                <input
                  type="number"
                  placeholder="$0.00"
                  value={item.cost}
                  onChange={(e) => { const n = [...items]; n[idx].cost = e.target.value; setItems(n); }}
                  className="w-24 text-xs font-bold bg-muted border border-border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-right"
                />
                {items.length > 1 && (
                  <Button type="button" size="xs" variant="ghost" onClick={() => setItems(items.filter((_, i) => i !== idx))} className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-500/10">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Tax + Discount */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tax (%)" type="number" step="0.1" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} className="text-xs font-medium text-foreground" />
            <Input label="Discount ($)" type="number" step="0.01" value={discountAmt} onChange={(e) => setDiscountAmt(e.target.value)} className="text-xs font-medium text-foreground" />
          </div>

          {/* Totals Summary */}
          <div className="bg-muted/50 border border-border rounded-xl p-3 space-y-1.5 text-xs font-semibold">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax ({taxPct}%)</span><span>${taxAmount.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>-${(parseFloat(discountAmt) || 0).toFixed(2)}</span></div>
            <div className="flex justify-between font-extrabold text-foreground border-t border-border pt-1.5"><span>Total Due</span><span className="text-primary">${total.toFixed(2)}</span></div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)} className="font-bold text-xs">Cancel</Button>
            <Button type="submit" size="sm" className="font-bold text-xs">{editingInv ? 'Update Invoice' : 'Create Invoice'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PAYMENTS TAB
// ═══════════════════════════════════════════════════════════════════════════════
export function BillingPaymentsTab() {
  const { payments, invoices, recordPayment, deletePayment } = useBillingStore();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Card');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  // Filter for month-wise download
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const selectedInvoice = useMemo(() => invoices.find((inv) => inv.id === invoiceId), [invoices, invoiceId]);
  const balance = useMemo(() => selectedInvoice ? Math.max(0, selectedInvoice.amount - (selectedInvoice.patientPaid || 0) - (selectedInvoice.insurancePaid || 0)) : 0, [selectedInvoice]);

  const openPayables = useMemo(() => invoices.filter((inv) => inv.status !== 'Paid'), [invoices]);

  const handleOpenRecord = () => {
    setInvoiceId(openPayables[0]?.id || '');
    setAmount('');
    setMethod('Card');
    setPayDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!invoiceId) { toast.error('Please select an invoice.'); return; }
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter a valid payment amount.'); return; }

    recordPayment({
      invoiceId,
      patientName: selectedInvoice?.patientName || '',
      amount: parseFloat(amount),
      method,
      date: payDate,
      note
    });
    toast.success(`$${parseFloat(amount).toFixed(2)} payment recorded via ${method}.`);
    setIsOpen(false);
  };

  const handleDownloadMonthly = () => {
    const prefix = `${filterYear}-${String(filterMonth).padStart(2, '0')}`;
    const rows = payments.filter((p) => p.date.startsWith(prefix)).map((p) => ({
      'Payment ID': p.id,
      'Invoice Ref': p.invoiceId,
      'Patient': p.patientName,
      'Amount': p.amount.toFixed(2),
      'Method': p.method,
      'Date': p.date,
      'Note': p.note || ''
    }));
    if (rows.length === 0) { toast.warning('No payments found for the selected month.'); return; }
    downloadCSV(`payments_${prefix}.csv`, rows, Object.keys(rows[0]));
    toast.success(`Exported ${rows.length} payments for ${prefix}.`);
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const columns = [
    { key: 'id', header: 'Payment ID', render: (p) => <span className="font-bold text-slate-500 text-[11px]">#{p.id}</span> },
    { key: 'invoiceId', header: 'Invoice Ref', render: (p) => <span className="font-extrabold text-primary text-xs">#{p.invoiceId}</span> },
    { key: 'patientName', header: 'Patient', render: (p) => <span className="font-extrabold text-foreground text-xs">{p.patientName}</span> },
    { key: 'amount', header: 'Amount', render: (p) => <span className="font-extrabold text-emerald-500 text-xs">+${p.amount.toFixed(2)}</span> },
    { key: 'method', header: 'Method', render: (p) => <Badge variant="secondary" className="font-bold text-[9px] uppercase">{p.method}</Badge> },
    { key: 'date', header: 'Date', render: (p) => <span className="text-xs font-medium text-muted-foreground">{p.date}</span> },
    { key: 'note', header: 'Note', render: (p) => <span className="text-[10px] text-muted-foreground">{p.note || '—'}</span> },
    {
      key: 'actions', header: '', align: 'right',
      render: (p) => (
        <Button size="xs" variant="ghost" onClick={() => { deletePayment(p.id); toast.warning('Payment record removed.'); }} className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-500/10">
          <Trash2 className="h-3 w-3" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Payments</h2>
          <p className="text-xs text-muted-foreground font-semibold">Record and track payments with multi-method support and month-wise export.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Month-wise filter + download */}
          <select value={filterMonth} onChange={(e) => setFilterMonth(Number(e.target.value))} className="text-xs font-bold bg-muted border border-border rounded-lg p-2 focus:outline-none text-foreground">
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <input type="number" value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))} className="w-20 text-xs font-bold bg-muted border border-border rounded-lg p-2 focus:outline-none text-foreground" />
          <Button size="sm" variant="outline" onClick={handleDownloadMonthly} className="font-bold text-xs gap-1.5 h-9">
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button size="sm" onClick={handleOpenRecord} className="font-bold text-xs gap-1.5 h-9">
            <Plus className="h-4 w-4" /> Record Payment
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
        <DataTable columns={columns} data={payments} searchKey="patientName" searchPlaceholder="Search payments..." pageSize={10} />
      </div>

      {/* Record Payment Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Record Patient Payment">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Select Invoice *</label>
            <select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2.5 focus:outline-none cursor-pointer text-foreground">
              {openPayables.map((inv) => (
                <option key={inv.id} value={inv.id}>#{inv.id} — {inv.patientName} (Balance: ${Math.max(0, inv.amount - (inv.patientPaid || 0) - (inv.insurancePaid || 0)).toFixed(2)})</option>
              ))}
            </select>
          </div>

          {selectedInvoice && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-xl">
              <Receipt className="h-4 w-4 text-primary" />
              <div className="text-xs">
                <span className="font-extrabold text-foreground">{selectedInvoice.patientName}</span>
                <span className="text-muted-foreground font-semibold"> · Outstanding: </span>
                <span className="font-extrabold text-rose-500">${balance.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount ($) *" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="text-xs font-medium text-foreground" required />
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Payment Method *</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2.5 focus:outline-none cursor-pointer text-foreground">
                {['Cash', 'Card', 'UPI', 'Insurance', 'Bank Transfer', 'Cheque'].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <Input label="Payment Date *" type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} className="text-xs font-medium text-foreground" required />
          <Input label="Notes (optional)" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Co-pay at checkout, insurance reimbursement..." className="text-xs font-medium text-foreground" />

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)} className="font-bold text-xs">Cancel</Button>
            <Button type="submit" size="sm" className="font-bold text-xs">Confirm Payment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. CLAIMS TAB
// ═══════════════════════════════════════════════════════════════════════════════
export function BillingClaimsTab() {
  const { claims, invoices, createClaim, updateClaimStatus, deleteClaim } = useBillingStore();
  const toast = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeClaim, setActiveClaim] = useState(null);

  const [invoiceId, setInvoiceId] = useState('');
  const [carrier, setCarrier] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimNote, setClaimNote] = useState('');

  const [reviewStatus, setReviewStatus] = useState('Approved');
  const [approvedAmt, setApprovedAmt] = useState('');

  const eligibleInvoices = useMemo(() => invoices.filter((inv) => inv.amount > 0), [invoices]);
  const selectedInvoice = useMemo(() => invoices.find((inv) => inv.id === invoiceId), [invoices, invoiceId]);

  const handleOpenCreate = () => {
    setInvoiceId(eligibleInvoices[0]?.id || '');
    setCarrier('');
    setClaimAmount('');
    setClaimNote('');
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!carrier || !claimAmount) { toast.error('Carrier and claim amount are required.'); return; }
    createClaim({
      invoiceId,
      patientName: selectedInvoice?.patientName || '',
      carrier,
      claimAmount: parseFloat(claimAmount),
      note: claimNote
    });
    toast.success(`Insurance claim submitted to ${carrier}.`);
    setIsCreateOpen(false);
  };

  const handleOpenReview = (claim) => {
    setActiveClaim(claim);
    setReviewStatus('Approved');
    setApprovedAmt(String(claim.claimAmount));
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    updateClaimStatus(activeClaim.id, reviewStatus, parseFloat(approvedAmt) || 0);
    toast.success(`Claim ${activeClaim.id} marked as ${reviewStatus}.`);
    setIsReviewOpen(false);
  };

  const columns = [
    { key: 'id', header: 'Claim ID', render: (c) => <span className="font-bold text-slate-500 text-[11px]">#{c.id}</span> },
    { key: 'patientName', header: 'Patient', render: (c) => <span className="font-extrabold text-foreground text-xs">{c.patientName}</span> },
    { key: 'invoiceId', header: 'Invoice', render: (c) => <span className="font-bold text-primary text-xs">#{c.invoiceId}</span> },
    { key: 'carrier', header: 'Insurance Carrier', render: (c) => <span className="text-xs font-semibold text-foreground">{c.carrier}</span> },
    { key: 'claimAmount', header: 'Claim Amount', render: (c) => <span className="font-extrabold text-foreground text-xs">${c.claimAmount.toFixed(2)}</span> },
    { key: 'approvedAmount', header: 'Approved', render: (c) => <span className={`font-extrabold text-xs ${c.status === 'Approved' ? 'text-emerald-500' : 'text-muted-foreground'}`}>${c.approvedAmount.toFixed(2)}</span> },
    { key: 'submittedDate', header: 'Submitted', render: (c) => <span className="text-xs font-medium text-muted-foreground">{c.submittedDate}</span> },
    { key: 'status', header: 'Status', render: (c) => <InvoiceStatusBadge status={c.status} /> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (c) => (
        <div className="flex gap-1.5 justify-end">
          {c.status === 'Pending' && (
            <Button size="xs" variant="outline" onClick={() => handleOpenReview(c)} className="h-7 gap-1 font-bold text-[9px] text-indigo-500 border-indigo-500/20 hover:bg-indigo-500/10">
              <ArrowRight className="h-3 w-3" /> Review
            </Button>
          )}
          <Button size="xs" variant="ghost" onClick={() => { deleteClaim(c.id); toast.warning(`Claim ${c.id} deleted.`); }} className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-500/10">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Insurance Claims</h2>
          <p className="text-xs text-muted-foreground font-semibold">Submit and track insurance claims from patient invoices.</p>
        </div>
        <Button size="sm" onClick={handleOpenCreate} className="font-bold text-xs gap-1.5 h-9">
          <Plus className="h-4 w-4" /> Submit Claim
        </Button>
      </div>

      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
        <DataTable columns={columns} data={claims} searchKey="patientName" searchPlaceholder="Search claims..." pageSize={10} />
      </div>

      {/* Create Claim Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Submit Insurance Claim">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Select Invoice *</label>
            <select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2.5 focus:outline-none cursor-pointer text-foreground">
              {eligibleInvoices.map((inv) => <option key={inv.id} value={inv.id}>#{inv.id} — {inv.patientName} (${inv.amount.toFixed(2)})</option>)}
            </select>
          </div>
          <Input label="Insurance Carrier *" value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="e.g. Blue Cross Blue Shield" className="text-xs font-medium text-foreground" required />
          <Input label="Claim Amount ($) *" type="number" step="0.01" value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} placeholder="0.00" className="text-xs font-medium text-foreground" required />
          <Input label="Notes" value={claimNote} onChange={(e) => setClaimNote(e.target.value)} placeholder="Claim notes or authorization details..." className="text-xs font-medium text-foreground" />
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)} className="font-bold text-xs">Cancel</Button>
            <Button type="submit" size="sm" className="font-bold text-xs">Submit Claim</Button>
          </div>
        </form>
      </Modal>

      {/* Review Claim Modal */}
      <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title={`Review Claim — ${activeClaim?.id}`}>
        {activeClaim && (
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-muted/50 border border-border rounded-xl space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground font-semibold">Patient:</span><span className="font-extrabold">{activeClaim.patientName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-semibold">Carrier:</span><span className="font-extrabold">{activeClaim.carrier}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-semibold">Submitted:</span><span className="font-extrabold">${activeClaim.claimAmount.toFixed(2)}</span></div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Decision</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setReviewStatus('Approved')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-bold text-xs transition-all ${reviewStatus === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </button>
                <button type="button" onClick={() => setReviewStatus('Rejected')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-bold text-xs transition-all ${reviewStatus === 'Rejected' ? 'bg-rose-500/10 border-rose-500/40 text-rose-600' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </button>
              </div>
            </div>
            {reviewStatus === 'Approved' && (
              <Input label="Approved Amount ($)" type="number" step="0.01" value={approvedAmt} onChange={(e) => setApprovedAmt(e.target.value)} className="text-xs font-medium text-foreground" required />
            )}
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsReviewOpen(false)} className="font-bold text-xs">Cancel</Button>
              <Button type="submit" size="sm" className="font-bold text-xs">Confirm Decision</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. STATEMENTS TAB
// ═══════════════════════════════════════════════════════════════════════════════
export function BillingStatementsTab() {
  const { invoices, payments, statements, generateStatement, deleteStatement } = useBillingStore();
  const { patients } = usePatientStore();
  const toast = useToast();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [periodStart, setPeriodStart] = useState('2026-01-01');
  const [periodEnd, setPeriodEnd] = useState(new Date().toISOString().split('T')[0]);

  const selectedPatient = useMemo(() => patients.find((p) => p.id === selectedPatientId), [patients, selectedPatientId]);

  const patientInvoices = useMemo(() =>
    invoices.filter((inv) => inv.patientId === selectedPatientId || inv.patientName === selectedPatient?.name),
    [invoices, selectedPatientId, selectedPatient]
  );

  const patientPayments = useMemo(() =>
    payments.filter((p) => p.patientName === selectedPatient?.name),
    [payments, selectedPatient]
  );

  const totals = useMemo(() => {
    const billed = patientInvoices.reduce((s, inv) => s + inv.amount, 0);
    const paid = patientInvoices.reduce((s, inv) => s + (inv.patientPaid || 0) + (inv.insurancePaid || 0), 0);
    return { billed, paid, balance: billed - paid };
  }, [patientInvoices]);

  const handleGenerate = () => {
    if (!selectedPatient) { toast.error('Select a patient first.'); return; }
    generateStatement(selectedPatientId, selectedPatient.name, periodStart, periodEnd);
    toast.success(`Statement generated for ${selectedPatient.name}.`);
  };

  const handleDownload = () => {
    if (!selectedPatient) { toast.error('Select a patient first.'); return; }
    const invRows = patientInvoices.map((inv) => ({
      Type: 'Invoice',
      'Ref ID': inv.id,
      Date: inv.date,
      Description: inv.items?.map((i) => i.description).join('; ') || '',
      Amount: `$${inv.amount.toFixed(2)}`,
      'Patient Paid': `$${(inv.patientPaid || 0).toFixed(2)}`,
      'Insurance Paid': `$${(inv.insurancePaid || 0).toFixed(2)}`,
      Status: inv.status
    }));
    const payRows = patientPayments.map((p) => ({
      Type: 'Payment',
      'Ref ID': p.id,
      Date: p.date,
      Description: p.note || '',
      Amount: `$${p.amount.toFixed(2)}`,
      'Patient Paid': `$${p.amount.toFixed(2)}`,
      'Insurance Paid': '',
      Status: p.method
    }));
    const rows = [...invRows, ...payRows];
    if (rows.length === 0) { toast.warning('No data available for this patient.'); return; }
    downloadCSV(`statement_${selectedPatient.name.replace(/\s+/g, '_')}.csv`, rows, Object.keys(rows[0]));
    toast.success(`Statement CSV downloaded for ${selectedPatient.name}.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Patient Statements</h2>
          <p className="text-xs text-muted-foreground font-semibold">Generate and download full financial statements per patient.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Select Patient</label>
            <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} className="w-full text-xs font-bold bg-muted border border-border rounded-lg p-2.5 focus:outline-none cursor-pointer text-foreground">
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <Input label="Period Start" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="text-xs font-medium text-foreground" />
          <Input label="Period End" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="text-xs font-medium text-foreground" />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleGenerate} className="font-bold text-xs gap-1.5 h-9 flex-1">
              <FileText className="h-4 w-4" /> Generate
            </Button>
            <Button size="sm" onClick={handleDownload} className="font-bold text-xs gap-1.5 h-9 flex-1">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </div>

      {/* Patient Statement Preview */}
      {selectedPatient && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Statement Header */}
          <div className="p-5 border-b border-border flex items-start justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-foreground">Patient Financial Statement</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                {selectedPatient.name} · {selectedPatient.email} · Period: {periodStart} to {periodEnd}
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Balance Due</div>
              <div className={`text-xl font-black ${totals.balance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>${Math.max(0, totals.balance).toFixed(2)}</div>
            </div>
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            {[
              { label: 'Total Billed', value: `$${totals.billed.toFixed(2)}`, color: 'text-foreground' },
              { label: 'Total Paid', value: `$${totals.paid.toFixed(2)}`, color: 'text-emerald-500' },
              { label: 'Outstanding', value: `$${Math.max(0, totals.balance).toFixed(2)}`, color: 'text-rose-500' }
            ].map((item) => (
              <div key={item.label} className="p-4 text-center">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</div>
                <div className={`text-base font-extrabold mt-1 ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Invoice History Table */}
          <div className="p-5 space-y-3">
            <h4 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Invoice History</h4>
            {patientInvoices.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No invoices found for this patient.</p>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    <th className="py-2.5">Invoice</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Services</th>
                    <th className="py-2.5 text-right">Total</th>
                    <th className="py-2.5 text-right">Paid</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {patientInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-bold text-primary">#{inv.id}</td>
                      <td className="py-2.5 text-muted-foreground">{inv.date}</td>
                      <td className="py-2.5 text-muted-foreground max-w-[200px] truncate">{inv.items?.map((i) => i.description).join(', ')}</td>
                      <td className="py-2.5 font-extrabold text-right">${inv.amount.toFixed(2)}</td>
                      <td className="py-2.5 font-extrabold text-emerald-500 text-right">${((inv.patientPaid || 0) + (inv.insurancePaid || 0)).toFixed(2)}</td>
                      <td className="py-2.5 text-center"><InvoiceStatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Payment History */}
          {patientPayments.length > 0 && (
            <div className="p-5 border-t border-border space-y-3">
              <h4 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Payment History</h4>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    <th className="py-2">Ref</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Method</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {patientPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2 font-bold text-primary">#{p.id}</td>
                      <td className="py-2 text-muted-foreground">{p.date}</td>
                      <td className="py-2"><Badge variant="secondary" className="font-bold text-[9px]">{p.method}</Badge></td>
                      <td className="py-2 font-extrabold text-emerald-500 text-right">+${p.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Generated Statements Archive */}
      {statements.length > 0 && (
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-extrabold text-sm text-foreground">Statement Archive</h3>
          <div className="space-y-2">
            {statements.map((stmt) => (
              <div key={stmt.id} className="flex items-center justify-between p-3 bg-muted/40 border border-border/60 rounded-xl">
                <div>
                  <p className="text-xs font-extrabold text-foreground">{stmt.patientName}</p>
                  <p className="text-[9px] text-muted-foreground font-semibold">{stmt.periodStart} – {stmt.periodEnd} · Generated: {stmt.generatedDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground font-semibold">Balance</p>
                    <p className={`text-xs font-extrabold ${stmt.balance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>${Math.max(0, stmt.balance).toFixed(2)}</p>
                  </div>
                  <Button size="xs" variant="ghost" onClick={() => { deleteStatement(stmt.id); toast.warning(`Statement ${stmt.id} deleted.`); }} className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-500/10">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
