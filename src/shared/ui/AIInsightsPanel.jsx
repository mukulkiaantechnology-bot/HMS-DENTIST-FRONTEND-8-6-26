import { useMemo } from 'react';
import { Sparkles, AlertTriangle, Lightbulb, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function AIInsightsPanel() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || 'dentist';

  // Role-specific simulated medical & operational insights
  const insights = useMemo(() => {
    switch (role) {
      case 'super_admin':
        return [
          {
            type: 'risk',
            title: 'Trial Underperformance Risk',
            desc: 'Westside Pediatric Dental (Tacoma) has not onboarded clinic staff or patients in the past 48 hours. Trial conversion risk is elevated.',
            badge: 'High Risk',
            color: 'red'
          },
          {
            type: 'suggestion',
            title: 'SaaS License Tier Upsell',
            desc: 'Northside Family Dentistry is approaching their 500 patient cap on the Basic tier. Auto-suggest Premium Plan upgrade via dashboard notification.',
            badge: 'Smart Action',
            color: 'indigo'
          },
          {
            type: 'recommendation',
            title: 'API Call Rate Spike',
            desc: 'Metropolitan Dental Care generated 450+ neural radiograph checks in 24 hours. Recommend adjusting regional rate limits to avoid throttling.',
            badge: 'System Rec',
            color: 'amber'
          }
        ];
      case 'clinic_owner':
        return [
          {
            type: 'risk',
            title: 'Revenue Recurrence Warning',
            desc: 'Active outstanding claims total $8,450. Average claim settlement time is 18.5 days. Cash flow stability score: 84%.',
            badge: 'Financial Risk',
            color: 'red'
          },
          {
            type: 'suggestion',
            title: 'AI SMS Recall Opportunity',
            desc: '124 patients are overdue for standard 6-month prophylaxis checks. Triggering Recall SMS AI could recover up to $18,600 in bookings.',
            badge: 'Revenue Lead',
            color: 'indigo'
          },
          {
            type: 'recommendation',
            title: 'Workload Allocation',
            desc: 'Provider load is predicted to peak at 110% on Thursday morning. Recommend assigning Dental Assistant David Miller to chairside support.',
            badge: 'Provider Opt',
            color: 'amber'
          }
        ];
      case 'dentist':
        return [
          {
            type: 'risk',
            title: 'Caries Progression Alarm',
            desc: 'James Carter (Patient #pat-1) distal radiolucency on #14 has progressed 8% since the last bite-wing scan (Dec 2025). Caries risk: High.',
            badge: 'EHR Audit',
            color: 'red'
          },
          {
            type: 'suggestion',
            title: 'Substitute Drug Safety Warning',
            desc: 'Patient is highly allergic to Penicillin. Alternative drug Clindamycin 300mg suggested for prophylaxis pre-medication.',
            badge: 'Safety First',
            color: 'rose'
          },
          {
            type: 'recommendation',
            title: 'Crown Fabrication Sync',
            desc: 'PFM Crown case for Mary Watson (#pat-2) was marked delivered by external lab. Schedule crown placement appointment slot.',
            badge: 'Treatment Rec',
            color: 'amber'
          }
        ];
      case 'hygienist':
        return [
          {
            type: 'risk',
            title: 'Gingival Recession Alert',
            desc: 'Mary Watson shows localized periodontal pocket depths of 4-5mm on lower mandibular molars. Perio disease status: Stage I suspect.',
            badge: 'Clinical Alert',
            color: 'red'
          },
          {
            type: 'suggestion',
            title: 'Recall Timing Adjustment',
            desc: 'Patient Alex Johnson has completed orthodontic checks. Recommend scheduling periodic root debridement in 3 months instead of 6.',
            badge: 'Hygiene Plan',
            color: 'indigo'
          },
          {
            type: 'recommendation',
            title: 'Prophy Recall Trigger',
            desc: 'AI recommends allocating 45 minutes for periodic scaling and root planing for today\'s walk-ins due to high calculus scores.',
            badge: 'Smart Assist',
            color: 'amber'
          }
        ];
      case 'front_desk':
      case 'frontdesk':
        return [
          {
            type: 'risk',
            title: 'Waitlist Schedule Risk',
            desc: 'Dr. Michael Chen has an open slot at 2:00 PM due to cancellation. High risk of lost productivity ($250 estimated value).',
            badge: 'Booking Alert',
            color: 'red'
          },
          {
            type: 'suggestion',
            title: 'Smart Waitlist Auto-Match',
            desc: 'Waitlisted patient Zaphod Beeblebrox requires a Root Canal Check and matches Dr. Chen\'s open 2:00 PM slot. Click to send booking SMS.',
            badge: 'Auto-Match',
            color: 'indigo'
          },
          {
            type: 'recommendation',
            title: 'Insurance Co-Pay Pre-Auth',
            desc: 'Patient Arthur Dent (Walk-in) eligibility check is pending with Cigna. Request insurance verification before dental charting starts.',
            badge: 'Intake Rec',
            color: 'amber'
          }
        ];
      case 'dental_assistant':
      case 'assistant':
        return [
          {
            type: 'risk',
            title: 'Scan Upload Pending',
            desc: 'No bite-wing radiographs loaded for scheduled patient Mary Watson. Confirm radiograph order with clinician.',
            badge: 'Imaging Due',
            color: 'red'
          },
          {
            type: 'suggestion',
            title: 'Chairside Support Checklist',
            desc: 'Root Canal procedure on #19 is scheduled for Dr. Chen at 11:30 AM. Pre-stage endodontic files and rubber dam setup.',
            badge: 'Preparation',
            color: 'indigo'
          },
          {
            type: 'recommendation',
            title: 'Sterilization Queue Count',
            desc: 'Autoclave unit 2 has completed cycle 4. Verify diagnostic cassette indicator tags and restock exam drawer 3.',
            badge: 'Clinic Ops',
            color: 'amber'
          }
        ];
      case 'lab_coordinator':
        return [
          {
            type: 'risk',
            title: 'Restoration Fabrication Delay',
            desc: 'Implant Case #lb-902 (Apex Clinic) is marked "In Progress" at external lab but is overdue by 24 hours. Delivery date risk: High.',
            badge: 'Shipping Alert',
            color: 'red'
          },
          {
            type: 'suggestion',
            title: 'Quality Check Stage Priority',
            desc: 'Crown case #lb-901 for Mary Watson is awaiting dimensional audit. Schedule occlusion scan review with laboratory technician.',
            badge: 'QC Standard',
            color: 'indigo'
          },
          {
            type: 'recommendation',
            title: 'Lab Dispatch Optimization',
            desc: 'Aggregate 4 cases for Apex Dental to ship in a single batch to reduce regional logistics handling costs by 15%.',
            badge: 'Workflow Rec',
            color: 'amber'
          }
        ];
      case 'patient':
        return [
          {
            type: 'risk',
            title: 'Outstanding Co-Pay Dues',
            desc: 'Your co-pay statement for Invoice #inv-1002 has a remaining balance of $450. MetLife insurance contribution applied.',
            badge: 'Billing Alert',
            color: 'red'
          },
          {
            type: 'suggestion',
            title: 'Preventive Care Opportunity',
            desc: 'Based on your tooth #14 cavity filling, clinical AI suggests regular use of fluoridated mouthwash and interdental cleaning.',
            badge: 'Oral Health',
            color: 'indigo'
          },
          {
            type: 'recommendation',
            title: 'Next Slot Booking',
            desc: 'You have a proposed porcelain crown replacement on tooth #3. Click to book a slot for next Wednesday morning.',
            badge: 'Appointment',
            color: 'amber'
          }
        ];
      default:
        return [];
    }
  }, [role]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-5 shadow-sm space-y-4 text-left w-full max-w-full">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider">
            Clinical AI Insights
          </h3>
        </div>
        <span className="text-[8px] font-black uppercase text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full select-none">
          Active Co-Pilot
        </span>
      </div>

      {/* Grid container: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for desktop row-based layouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((ins, idx) => {
          let IconComp = Lightbulb;
          let colorClasses = 'bg-indigo-500/5 border-indigo-500/15 text-indigo-600 dark:text-indigo-400';
          let iconColor = 'text-indigo-500';

          if (ins.type === 'risk') {
            IconComp = AlertTriangle;
            colorClasses = 'bg-rose-500/5 border-rose-500/15 text-rose-600 dark:text-rose-400';
            iconColor = 'text-rose-500';
          } else if (ins.type === 'recommendation') {
            IconComp = TrendingUp;
            colorClasses = 'bg-amber-500/5 border-amber-500/15 text-amber-600 dark:text-amber-400';
            iconColor = 'text-amber-500';
          }

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 text-xs leading-normal font-semibold shadow-xs transition-transform hover:-translate-y-0.5 duration-200 ${colorClasses}`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-[9px] uppercase tracking-wider block opacity-90 truncate">
                    {ins.title}
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0 border bg-background/50`}>
                    {ins.badge}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed mt-1">
                  {ins.desc}
                </p>
              </div>
              
              <div className="flex items-center gap-1.5 border-t border-current/10 pt-2.5 text-[9px] font-extrabold select-none">
                <IconComp className={`h-3.5 w-3.5 ${iconColor}`} />
                <span>Simulated Diagnostic Advice</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AIInsightsPanel;
