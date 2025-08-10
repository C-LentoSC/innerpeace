"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, Clock, CheckCircle, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface BookingModalProps {
  packageId: string | number;
  open: boolean;
  onClose: () => void;
}

type Pkg = { id: string; duration?: number; durationInMinutes?: number };

export default function BookingModal({ packageId, open, onClose }: BookingModalProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeStr, setSelectedTimeStr] = useState<string | null>(null);
  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());

  // Load package to compute end time from duration
  useEffect(() => {
    if (!open || !packageId) return;
    (async () => {
      try {
        const res = await fetch(`/api/packages/${packageId}`);
        if (res.ok) {
          const j = await res.json();
          setPkg(j);
        }
      } catch {}
    })();
  }, [open, packageId]);

  // Generate 30-min slots between 09:00 and 21:00
  const slots = useMemo(() => {
    const arr: string[] = [];
    for (let h = 9; h <= 21; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        arr.push(`${hh}:${mm}`);
      }
    }
    return arr;
  }, []);

  // When date selects, fetch availability for that date
  useEffect(() => {
    if (!selectedDate) return;
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");
    const date = `${yyyy}-${mm}-${dd}`;
    setLoadingTimes(true);
    (async () => {
      try {
        const results = await Promise.all(
          slots.map(async (t) => {
            const r = await fetch(`/api/availability?date=${date}&time=${encodeURIComponent(t)}`);
            if (!r.ok) return { t, available: false };
            const j = await r.json();
            return { t, available: Boolean(j?.available) };
          })
        );
        const taken = new Set<string>();
        results.forEach((r) => { if (!r.available) taken.add(r.t); });
        setUnavailable(taken);
      } catch {
        setUnavailable(new Set());
      } finally {
        setLoadingTimes(false);
      }
    })();
  }, [selectedDate, slots]);

  if (!open) return null;

  const onContinue = () => {
    if (!selectedDate || !selectedTimeStr) return;
    const d = selectedDate;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const date = `${yyyy}-${mm}-${dd}`;
    const params = new URLSearchParams({ packageId: String(packageId), date, time: selectedTimeStr });
    router.push(`/checkout?${params.toString()}`);
    onClose();
  };

  const computeEndTime = (start: string | null): string | null => {
    if (!start) return null;
    const duration = (pkg?.duration as number) || (pkg?.durationInMinutes as number) || 0;
    if (!duration) return `${start}`;
    const [h, m] = start.split(":").map((n) => parseInt(n, 10));
    const startMin = h * 60 + m;
    const endMin = startMin + duration;
    const eh = String(Math.floor(endMin / 60)).padStart(2, "0");
    const em = String(endMin % 60).padStart(2, "0");
    return `${start} - ${eh}:${em}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold gradient-text1">Select Date & Time</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred appointment slot</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Date Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Select Date</label>
            </div>
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(d) => setSelectedDate(d)}
                minDate={new Date()}
                dateFormat="EEEE, MMMM d, yyyy"
                placeholderText="Choose your appointment date"
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-center font-medium"
                popperPlacement="bottom-start"
                showPopperArrow={false}
                calendarClassName="shadow-xl border-0 rounded-xl"
                dayClassName={() => 
                  "hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors cursor-pointer"
                }
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <label className="text-sm font-medium">Available Time Slots</label>
              {selectedDate && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              )}
            </div>
            
            {!selectedDate ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Please select a date first</p>
              </div>
            ) : loadingTimes ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground">Finding available slots...</p>
              </div>
            ) : (
              <div className="bg-background/30 rounded-xl p-4 border border-border/30">
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {slots.map((t) => {
                    const disabled = unavailable.has(t);
                    const active = selectedTimeStr === t;
                    const timeDisplay = computeEndTime(t) || t;
                    
                    return (
                      <button
                        key={t}
                        disabled={disabled}
                        onClick={() => setSelectedTimeStr(t)}
                        className={`
                          relative px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200
                          ${active 
                            ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                            : disabled 
                              ? 'border-border/30 bg-muted/20 text-muted-foreground cursor-not-allowed opacity-50'
                              : 'border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md'
                          }
                        `}
                        title={disabled ? 'This slot is not available' : `Book appointment: ${timeDisplay}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs opacity-75">
                            {t.split(':')[0] >= '12' ? 'PM' : 'AM'}
                          </span>
                          <span className="font-semibold">{timeDisplay}</span>
                          {active && (
                            <CheckCircle className="h-4 w-4 absolute -top-1 -right-1 bg-primary-foreground rounded-full" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {slots.filter(t => !unavailable.has(t)).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No available slots for this date</p>
                    <p className="text-xs mt-1">Please try another date</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Summary */}
          {selectedDate && selectedTimeStr && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Selected Appointment</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {computeEndTime(selectedTimeStr)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={onContinue} 
              disabled={!selectedDate || !selectedTimeStr}
              className="flex-1 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
