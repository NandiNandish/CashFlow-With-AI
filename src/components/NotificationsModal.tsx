import React from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  CalendarClock, 
  Sparkles, 
  CheckCircle2,
  Mail,
  ShieldAlert,
  Sliders,
  Trash2
} from 'lucide-react';
import { InAppNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: InAppNotification[];
  onOpenStressAlert: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenEmailPreview?: () => void;
  onDismissNotification?: (id: string) => void;
  onClearAll?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onOpenStressAlert,
  onNavigateTab,
  onOpenEmailPreview,
  onDismissNotification,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        id="notifications-modal"
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Notifications &amp; Alerts
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                  {notifications.length}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Real-time 80% spending cap &amp; cash-flow triggers</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onClearAll && notifications.length > 0 && (
              <button
                id="btn-clear-notifications"
                onClick={onClearAll}
                className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition-colors"
                title="Clear all alerts"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-white">All Clear! No Active Alerts</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                All categories are within safe thresholds (&lt;80% cap) and no cash-flow stress points are urgent.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isCapExceeded = notif.type === 'cap_exceeded';
              const isEmailSent = notif.type === 'email_sent';

              return (
                <div
                  key={notif.id}
                  id={`notification-item-${notif.id}`}
                  className={`p-3.5 rounded-xl border space-y-2 text-xs transition-colors ${
                    isCapExceeded
                      ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-500/60'
                      : isEmailSent
                      ? 'bg-cyan-950/30 border-cyan-500/40 hover:border-cyan-500/60'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {isCapExceeded ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : isEmailSent ? (
                        <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <Bell className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                      <span className="font-bold text-white leading-tight">
                        {notif.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {notif.time}
                      </span>
                      {onDismissNotification && (
                        <button
                          onClick={() => onDismissNotification(notif.id)}
                          className="text-slate-500 hover:text-slate-300 p-0.5 rounded"
                          title="Dismiss notification"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {notif.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onClose();
                        if (isEmailSent && onOpenEmailPreview) {
                          onOpenEmailPreview();
                        } else if (notif.actionTargetTab) {
                          onNavigateTab(notif.actionTargetTab);
                          if (notif.actionTargetTab === 'dashboard') {
                            onOpenStressAlert();
                          }
                        } else if (notif.onAction) {
                          notif.onAction();
                        }
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] underline flex items-center gap-1"
                    >
                      <span>{notif.actionText || 'Inspect Details'}</span>
                      <span>&rarr;</span>
                    </button>

                    {isCapExceeded && (
                      <span className="text-[10px] text-amber-400 font-mono font-medium bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30">
                        &gt;80% Limit Trigger
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onNavigateTab('spending');
            }}
            className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manage Spending Caps</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
