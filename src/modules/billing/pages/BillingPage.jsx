import { useState } from 'react';
import { CreditCard, Banknote, ShieldAlert, Receipt, DollarSign, Wallet } from 'lucide-react';
import { useBillingStore } from '../../../store/billingStore';
import { useClinicStore } from '../../../store/clinicStore';
import { DataTable } from '../../../shared/ui/DataTable';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Badge } from '../../../shared/ui/Badge';
import { useToast } from '../../../shared/hooks/useToast';

export function BillingPage() {
  const selectedClinicId = useClinicStore((state) => state.selectedClinicId);
  const clinics = useClinicStore((state) => state.clinics);
  const { invoices, payInvoice } = useBillingStore();
  const toast = useToast();

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // Filter invoices by selected clinic
  const filteredInvoices = invoices.filter((inv) => {
    if (selectedClinicId === 'all') return true;
    return inv.clinicId === selectedClinicId;
  });

  const handleOpenPayment = (invoice) => {
    setSelectedInvoice(invoice);
    const balance = invoice.amount - (invoice.insurancePaid + invoice.patientPaid);
    setPaymentAmount(balance.toFixed(2));
    setIsPayModalOpen(true);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid positive payment amount.');
      return;
    }

    const balance = selectedInvoice.amount - (selectedInvoice.insurancePaid + selectedInvoice.patientPaid);
    if (amount > balance) {
      toast.warning(`Payment amount exceeds the outstanding balance of $${balance}.`);
      return;
    }

    payInvoice(selectedInvoice.id, amount);
    toast.success(`Payment of $${amount.toLocaleString()} processed successfully for Invoice #${selectedInvoice.id}.`);
    setIsPayModalOpen(false);
  };

  // Map clinic ID to labels
  const clinicNames = clinics.reduce((acc, c) => {
    acc[c.id] = c.name;
    return acc;
  }, {});

  const columns = [
    { key: 'id', header: 'Invoice ID', render: (inv) => <span className="font-bold text-primary">#{inv.id}</span> },
    { key: 'patientName', header: 'Patient Name' },
    { key: 'date', header: 'Issue Date' },
    {
      key: 'clinicId',
      header: 'Clinic Location',
      render: (inv) => <span className="text-xs font-semibold text-muted-foreground">{clinicNames[inv.clinicId]?.split(' ')[0]}</span>
    },
    {
      key: 'amount',
      header: 'Billing Total',
      align: 'right',
      render: (inv) => <span className="font-bold">${inv.amount.toLocaleString()}</span>
    },
    {
      key: 'balance',
      header: 'Outstand. Balance',
      align: 'right',
      render: (inv) => {
        const balance = inv.amount - (inv.insurancePaid + inv.patientPaid);
        return <span className={`font-semibold ${balance > 0 ? 'text-destructive' : 'text-success'}`}>${balance.toLocaleString()}</span>;
      }
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (inv) => (
        <Badge
          variant={
            inv.status === 'Paid'
              ? 'success'
              : inv.status === 'Partial'
              ? 'info'
              : inv.status === 'Overdue'
              ? 'destructive'
              : 'warning'
          }
          className="text-[10px] font-semibold py-0.5 px-2"
        >
          {inv.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (inv) => {
        const balance = inv.amount - (inv.insurancePaid + inv.patientPaid);
        if (balance <= 0) return null;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenPayment(inv)}
            className="h-8 gap-1.5 text-xs font-bold"
          >
            <DollarSign className="h-3.5 w-3.5" />
            Pay Balance
          </Button>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Billing & Invoices</h1>
        <p className="text-sm text-muted-foreground font-semibold mt-1">
          Review financial summaries, print clinical invoices, and process patient co-pays.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total revenue */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Billed</span>
            <h3 className="text-2xl font-bold text-foreground">
              ${filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
            </h3>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-lg dark:bg-primary/20">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        {/* Collected co-pays */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Received</span>
            <h3 className="text-2xl font-bold text-foreground">
              ${filteredInvoices.reduce((sum, inv) => sum + inv.patientPaid + inv.insurancePaid, 0).toLocaleString()}
            </h3>
          </div>
          <div className="bg-success/10 text-success p-3 rounded-lg dark:bg-success/20">
            <Receipt className="h-5 w-5" />
          </div>
        </div>

        {/* Outstanding accounts */}
        <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Outstanding</span>
            <h3 className="text-2xl font-bold text-destructive">
              $
              {filteredInvoices
                .reduce((sum, inv) => sum + (inv.amount - (inv.patientPaid + inv.insurancePaid)), 0)
                .toLocaleString()}
            </h3>
          </div>
          <div className="bg-destructive/10 text-destructive p-3 rounded-lg dark:bg-destructive/20">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main invoices grid */}
      <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
        <DataTable
          columns={columns}
          data={filteredInvoices}
          searchPlaceholder="Search invoices by patient name..."
          searchKey="patientName"
          pageSize={10}
        />
      </div>

      {/* Payment Gateway Dialog */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Simulate Payment Gateway">
        {selectedInvoice && (
          <form onSubmit={handleProcessPayment} className="space-y-5">
            <div className="bg-muted/50 p-4 border border-border rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground uppercase">Patient</span>
                <span className="font-bold text-foreground">{selectedInvoice.patientName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground uppercase">Invoice ID</span>
                <span className="font-bold text-foreground">#{selectedInvoice.id}</span>
              </div>
              <div className="h-px bg-border my-1" />
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground uppercase">Total Charge</span>
                <span className="font-bold text-foreground">${selectedInvoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground uppercase">Insurance Paid</span>
                <span className="font-bold text-success">${selectedInvoice.insurancePaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground uppercase">Patient Paid</span>
                <span className="font-bold text-success">${selectedInvoice.patientPaid.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border my-1" />
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-foreground">Remaining Balance</span>
                <span className="font-extrabold text-destructive">
                  $
                  {(
                    selectedInvoice.amount -
                    (selectedInvoice.insurancePaid + selectedInvoice.patientPaid)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <Input
              label="Enter Co-Pay Amount ($)"
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="e.g. 50.00"
            />

            {/* Payment Method Selector Grid */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method of Payment</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 p-3 border border-primary/20 bg-primary/5 rounded-xl text-left cursor-pointer focus:ring-2 focus:ring-primary"
                >
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold">Credit/Debit Card</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 p-3 border border-border bg-card rounded-xl text-left hover:bg-muted cursor-pointer"
                  onClick={() => toast.info('Selected Cash / Check method.')}
                >
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-foreground/80">Cash / Check</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" type="button" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Process Co-Pay</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
export default BillingPage;
