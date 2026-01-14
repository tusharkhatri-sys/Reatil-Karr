import React from 'react';

// Using inline styles with hex colors for html2canvas compatibility
// html2canvas cannot parse oklch() colors from TailwindCSS v4
const InvoiceReceipt = React.forwardRef(({ invoice, sellerProfile, customer }, ref) => {
    if (!invoice) return null;

    const styles = {
        container: {
            padding: '32px',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: 'sans-serif',
            maxWidth: '80mm',
            margin: '0 auto',
        },
        header: {
            textAlign: 'center',
            marginBottom: '24px',
            paddingTop: '16px',
        },
        businessName: {
            fontSize: '24px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            marginBottom: '4px',
        },
        smallText: {
            fontSize: '11px',
            color: '#475569',
        },
        divider: {
            borderBottom: '2px dashed #cbd5e1',
            width: '100%',
            margin: '16px 0',
        },
        row: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontWeight: '500',
        },
        bold: {
            fontWeight: '700',
        },
        tableHeader: {
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            borderTop: '1px solid #1e293b',
            borderBottom: '1px solid #1e293b',
            padding: '6px 0',
            marginBottom: '8px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
        },
        itemRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            fontSize: '11px',
            marginBottom: '4px',
        },
        totalSection: {
            borderTop: '1px solid #1e293b',
            paddingTop: '8px',
            fontSize: '11px',
            fontWeight: '700',
        },
        footer: {
            marginTop: '32px',
            textAlign: 'center',
        },
        footerText: {
            fontSize: '10px',
            fontWeight: '500',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '2px',
        },
        outstandingBox: {
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '4px',
            marginTop: '4px',
        }
    };

    return (
        <div ref={ref} style={styles.container} className="hidden print:block">
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.businessName}>{sellerProfile?.business_name || 'Retail Karr'}</h1>
                {sellerProfile?.address && <p style={styles.smallText}>{sellerProfile.address}</p>}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '11px', marginTop: '4px', fontWeight: '500', color: '#475569' }}>
                    {sellerProfile?.phone && <span>Ph: {sellerProfile.phone}</span>}
                    {sellerProfile?.gstin && <span>GST: {sellerProfile.gstin}</span>}
                </div>
                <div style={styles.divider} />
            </div>

            {/* Invoice Info */}
            <div style={{ ...styles.row, marginBottom: '16px' }}>
                <div>
                    <p>Bill No: <span style={styles.bold}>#{invoice.full_invoice_number || invoice.invoice_number}</span></p>
                    <p>Date: {new Date(invoice.created_at).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </div>
                {customer && (
                    <div style={{ textAlign: 'right' }}>
                        <p style={styles.bold}>{customer.name}</p>
                        <p>{customer.phone}</p>
                    </div>
                )}
            </div>

            {/* Table Header */}
            <div style={styles.tableHeader}>
                <div style={{ gridColumn: 'span 6' }}>Item</div>
                <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>Qty</div>
                <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>Rate</div>
                <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>Amt</div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '16px', minHeight: '50px' }}>
                {invoice.items && invoice.items.map((item, idx) => (
                    <div key={idx} style={styles.itemRow}>
                        <div style={{ gridColumn: 'span 6', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '4px' }}>{item.product_name}</div>
                        <div style={{ gridColumn: 'span 2', textAlign: 'right', color: '#475569' }}>{item.quantity} {item.unit}</div>
                        <div style={{ gridColumn: 'span 2', textAlign: 'right', color: '#475569' }}>{item.price}</div>
                        <div style={{ gridColumn: 'span 2', textAlign: 'right', fontWeight: '700' }}>{item.total}</div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div style={styles.totalSection}>
                <div style={styles.row}>
                    <span>Subtotal</span>
                    <span>₹{invoice.total_amount}</span>
                </div>

                {parseFloat(invoice.previous_balance) > 0 && (
                    <>
                        <div style={{ ...styles.row, borderTop: '1px dotted #94a3b8', paddingTop: '8px', marginTop: '8px' }}>
                            <span>Previous Outstanding</span>
                            <span>₹{Number(invoice.previous_balance).toFixed(2)}</span>
                        </div>
                        <div style={{ ...styles.row, fontSize: '14px', fontWeight: '900', paddingTop: '4px' }}>
                            <span>Net Payable</span>
                            <span>₹{(parseFloat(invoice.total_amount) + parseFloat(invoice.previous_balance)).toFixed(2)}</span>
                        </div>
                    </>
                )}

                <div style={{ ...styles.row, fontSize: '12px', marginTop: '8px', paddingTop: '8px', borderTop: '2px dashed #cbd5e1' }}>
                    <span>TOTAL BILL</span>
                    <span>₹{invoice.total_amount}</span>
                </div>

                <div style={{ ...styles.row, color: '#475569' }}>
                    <span>Paid [{invoice.payment_method}]</span>
                    <span>₹{Number(invoice.cash_received || invoice.paid_amount).toFixed(2)}</span>
                </div>

                {/* Advance Used */}
                {parseFloat(invoice.advance_used) > 0 && (
                    <div style={{ ...styles.row, color: '#059669', marginTop: '4px' }}>
                        <span>✓ Advance Used</span>
                        <span>- ₹{Number(invoice.advance_used).toFixed(2)}</span>
                    </div>
                )}

                {/* Advance Credited (for wholesale - overpayment becomes advance) */}
                {(() => {
                    const advanceCredited = parseFloat(invoice.new_advance || invoice.advance_credited || 0);
                    if (advanceCredited > 0) {
                        return (
                            <div style={{ ...styles.row, color: '#059669', marginTop: '4px', backgroundColor: '#d1fae5', padding: '4px', borderRadius: '4px' }}>
                                <span>★ Advance Credited</span>
                                <span>+ ₹{advanceCredited.toFixed(2)}</span>
                            </div>
                        );
                    }
                    return null;
                })()}

                {/* Change Return - Only for Retail (no advance credited) */}
                {(() => {
                    const advanceCredited = parseFloat(invoice.new_advance || invoice.advance_credited || 0);
                    const excessAmount = parseFloat(invoice.cash_received || invoice.paid_amount) - (parseFloat(invoice.total_amount) + parseFloat(invoice.previous_balance || 0) - parseFloat(invoice.advance_used || 0));
                    // Only show Change Return if NO advance was credited AND there's excess payment
                    if (excessAmount > 0 && advanceCredited === 0) {
                        return (
                            <div style={{ ...styles.row, marginTop: '4px', fontSize: '11px', borderTop: '1px dashed #cbd5e1', paddingTop: '4px' }}>
                                <span>Change Return</span>
                                <span>₹{excessAmount.toFixed(2)}</span>
                            </div>
                        );
                    }
                    return null;
                })()}

                <div style={{ ...styles.row, ...styles.outstandingBox, textTransform: 'uppercase', fontSize: '12px' }}>
                    <span>Total Outstanding</span>
                    <span>₹{Math.max(0, ((parseFloat(invoice.total_amount) + parseFloat(invoice.previous_balance || 0) - parseFloat(invoice.advance_used || 0)) - (parseFloat(invoice.cash_received || invoice.paid_amount)))).toFixed(2)}</span>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <p style={styles.footerText}>Thank you for visiting!</p>
                <div style={{ fontSize: '9px', color: '#94a3b8' }}>Powered by RetailKarr</div>
            </div>
        </div>
    );
});

export default InvoiceReceipt;
