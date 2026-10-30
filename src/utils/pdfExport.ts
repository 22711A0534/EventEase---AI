import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EventPlan } from '../types/event';
import { formatINR, formatDate } from './formatters';

export function exportPlanToPDF(plan: EventPlan): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const purplePrimary: [number, number, number] = [109, 40, 217]; // #6d28d9
  const purpleDark: [number, number, number] = [76, 29, 149]; // #4c1d95
  const slateDark: [number, number, number] = [30, 41, 59]; // #1e293b
  const slateMuted: [number, number, number] = [100, 116, 139]; // #64748b
  const emeraldGreen: [number, number, number] = [16, 185, 129]; // #10b981
  const bgSoft: [number, number, number] = [248, 250, 252]; // #f8fafc

  let y = margin;

  // 1. Top Decorative Brand Banner
  doc.setFillColor(...purpleDark);
  doc.rect(0, 0, pageWidth, 55, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('EventEase AI', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(233, 213, 255);
  doc.text('Plan Smarter. Celebrate Better. Make Every Event Memorable.', margin + 110, 32);

  doc.setFontSize(8);
  doc.setTextColor(216, 180, 254);
  const dateStr = `Exported: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  doc.text(dateStr, pageWidth - margin - doc.getTextWidth(dateStr), 32);

  y = 75;

  // 2. Event Title & Core Meta Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...slateDark);
  doc.text(plan.input.title, margin, y);
  y += 18;

  // Event Badges & Summary details
  doc.setFillColor(...bgSoft);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 54, 6, 6, 'FD');

  const totalBudget = Number(plan.input.budgetINR) || 0;
  const totalSpent = plan.budgetBreakdown.reduce(
    (acc, curr) => acc + (Number(curr.spentINR) || 0),
    0
  );
  const remaining = totalBudget - totalSpent;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...purplePrimary);
  doc.text(`EVENT TYPE: ${plan.input.eventType.toUpperCase()} ${plan.input.subType ? `(${plan.input.subType})` : ''}`, margin + 12, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);
  doc.text(`Date: ${formatDate(plan.input.date)}`, margin + 12, y + 34);
  doc.text(`Location: ${plan.input.location}`, margin + 160, y + 34);
  doc.text(`Guests: ${plan.input.guestCount} People`, margin + 310, y + 34);

  // Budget stats line
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Budget: ${formatINR(totalBudget)}`, margin + 12, y + 48);
  doc.setTextColor(...emeraldGreen);
  doc.text(`Tracked Spent: ${formatINR(totalSpent)}`, margin + 160, y + 48);
  doc.setTextColor(remaining >= 0 ? purplePrimary[0] : 225, remaining >= 0 ? purplePrimary[1] : 29, remaining >= 0 ? purplePrimary[2] : 72);
  doc.text(`Remaining Balance: ${formatINR(remaining)}`, margin + 310, y + 48);

  y += 66;

  // 3. Executive Summary
  if (plan.executiveSummary) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...slateDark);
    doc.text('Executive Summary', margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...slateMuted);
    const splitSummary = doc.splitTextToSize(plan.executiveSummary, contentWidth);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 12 + 10;
  }

  // 4. Budget Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...slateDark);
  doc.text('AI Budget Breakdown & Expense Tracking', margin, y);
  y += 6;

  const budgetTableBody = plan.budgetBreakdown.map((item) => {
    const allocated = Number(item.allocatedINR) || 0;
    const spent = Number(item.spentINR) || 0;
    const diff = allocated - spent;
    return [
      item.category,
      formatINR(allocated),
      formatINR(spent),
      diff < 0 ? `-${formatINR(Math.abs(diff))}` : formatINR(diff),
      item.priority,
      item.moneySavingTip || 'Compare quotes',
    ];
  });

  // Add summary row
  budgetTableBody.push([
    'TOTALS',
    formatINR(totalBudget),
    formatINR(totalSpent),
    formatINR(remaining),
    `${plan.budgetBreakdown.length} items`,
    remaining >= 0 ? 'Budget is healthy' : 'Exceeding budget warning',
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Category', 'Allocated', 'Actual Spent', 'Balance', 'Priority', 'Cost Saving Tip']],
    body: budgetTableBody,
    theme: 'grid',
    headStyles: {
      fillColor: purplePrimary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: slateDark,
      cellPadding: 4,
    },
    footStyles: {
      fillColor: bgSoft,
      textColor: slateDark,
      fontStyle: 'bold',
      fontSize: 8,
    },
    didParseCell: (data) => {
      // Bold the last row
      if (data.row.index === budgetTableBody.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [241, 245, 249];
      }
    },
    margin: { left: margin, right: margin },
  });

  // Get current Y after budget table
  // @ts-ignore
  y = doc.lastAutoTable.finalY + 18;

  // 5. Timeline Tasks Table
  if (plan.timeline && plan.timeline.length > 0) {
    if (y > pageHeight - 120) {
      doc.addPage();
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...slateDark);
    doc.text('AI Preparation Schedule & Key Milestones', margin, y);
    y += 6;

    const timelineTableBody = plan.timeline.map((task) => [
      task.phase,
      task.title,
      task.deadlineOffset || 'Prior to event',
      task.category,
      task.isCompleted ? 'Completed' : 'Pending',
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Phase', 'Task Title', 'Target Timeline', 'Category', 'Status']],
      body: timelineTableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229], // #4f46e5 indigo
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: slateDark,
        cellPadding: 4,
      },
      margin: { left: margin, right: margin },
    });

    // @ts-ignore
    y = doc.lastAutoTable.finalY + 18;
  }

  // 6. Vendor Checklist Table
  if (plan.vendorChecklist && plan.vendorChecklist.length > 0) {
    if (y > pageHeight - 120) {
      doc.addPage();
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...slateDark);
    doc.text('Vendor Coordination & Deliverables Checklist', margin, y);
    y += 6;

    const vendorTableBody = plan.vendorChecklist.map((vendor) => [
      vendor.category,
      vendor.estimatedCostINR,
      vendor.status,
      vendor.importance,
      vendor.deliverablesChecklist ? vendor.deliverablesChecklist.slice(0, 2).join('; ') : 'Deliverable review',
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Category', 'Est. Cost', 'Booking Status', 'Importance', 'Key Deliverables']],
      body: vendorTableBody,
      theme: 'grid',
      headStyles: {
        fillColor: purplePrimary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: slateDark,
        cellPadding: 4,
      },
      margin: { left: margin, right: margin },
    });

    // @ts-ignore
    y = doc.lastAutoTable.finalY + 18;
  }

  // 7. Personalized Creative Themes & Menu
  if (plan.creativeIdeas) {
    if (y > pageHeight - 120) {
      doc.addPage();
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...slateDark);
    doc.text('Personalized Creative Themes & Highlights', margin, y);
    y += 14;

    // Theme concepts
    if (plan.creativeIdeas.themes && plan.creativeIdeas.themes.length > 0) {
      plan.creativeIdeas.themes.slice(0, 2).forEach((theme) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...purplePrimary);
        doc.text(`Theme Concept: ${theme.name} - "${theme.tagline}"`, margin, y);
        y += 12;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...slateMuted);
        const splitTheme = doc.splitTextToSize(theme.description, contentWidth);
        doc.text(splitTheme, margin, y);
        y += splitTheme.length * 10 + 6;
      });
    }

    // Food highlights
    if (plan.creativeIdeas.foodAndBeverage) {
      const fb = plan.creativeIdeas.foodAndBeverage;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...slateDark);
      doc.text('Curated Menu Highlights:', margin, y);
      y += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...slateMuted);
      const menuText = `Welcome Drinks: ${(fb.welcomeDrinks || []).join(', ')} | Appetizers: ${(fb.appetizers || []).join(', ')} | Main Highlights: ${(fb.mainCourseHighlights || []).join(', ')}`;
      const splitMenu = doc.splitTextToSize(menuText, contentWidth);
      doc.text(splitMenu, margin, y);
      y += splitMenu.length * 10 + 10;
    }
  }

  // 8. Page numbering footer across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `EventEase AI • ${plan.input.title} • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );
  }

  // Trigger download
  const sanitizedTitle = (plan.input.title || 'Event_Plan').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${sanitizedTitle}_EventEase_MasterPlan.pdf`);
}
