"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface BookingModalProps {
  packageId: string | number;
  open: boolean;
  onClose: () => void;
}

export default function BookingModal({ packageId, open, onClose }: BookingModalProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStart, setSelectedStart] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  // Availability checks removed per requirement – allow any selected time

  // Package/duration fetching removed – not needed without availability checks

  const formatHHmm = (d: Date | null) => {
    if (!d) return "";
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };
  // Availability check removed

  if (!open) return null;

  const onContinue = async () => {
    if (!selectedDate || !selectedStart) return;
    const d = selectedDate;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const date = `${yyyy}-${mm}-${dd}`;

    const params = new URLSearchParams({ packageId: String(packageId), date, time: selectedStart });
    router.push(`/checkout?${params.toString()}`);
    onClose();
  };

  const formatTime = (): string | null => {
    if (!selectedStart) return null;
    return selectedStart;
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
              <label className="text-sm font-medium">Select Time</label>
              {selectedDate && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
            {!selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Please select a date first</p>
              </div>
            ) : (
              <div className="bg-background/30 rounded-xl p-4 border border-border/30 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground"></label>
                  <DatePicker
                    selected={startTime}
                    onChange={(d) => {
                      setStartTime(d);
                      setSelectedStart(formatHHmm(d));
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    placeholderText="Select time"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
                    popperPlacement="bottom-start"
                    showPopperArrow={false}
                  />
                </div>
                {/* Availability status removed */}
              </div>
            )}
          </div>

          {/* Selected Summary */}
          {selectedDate && selectedStart && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Selected Appointment</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {` at ${formatTime()}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error message removed */}

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
              disabled={!selectedDate || !selectedStart}
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
