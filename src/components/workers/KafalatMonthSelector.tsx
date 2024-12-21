import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, differenceInMonths, startOfMonth, isBefore, isAfter, isSameMonth, addYears } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface KafalatMonthSelectorProps {
  selectedMonths: string[];
  exemptMonths: string[];
  onMonthsChange: (months: string[], exemptMonths: string[]) => void;
  startDate: Date;
  monthlyAmount: number;
}

export function KafalatMonthSelector({ 
  selectedMonths, 
  exemptMonths,
  onMonthsChange, 
  startDate,
  monthlyAmount 
}: KafalatMonthSelectorProps) {
  const { t } = useTranslation();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  // Convert dates to start of month for proper comparison
  const startMonthDate = startOfMonth(new Date(startDate));
  const currentMonthDate = startOfMonth(currentDate);
  const maxDate = startOfMonth(addYears(currentDate, 2)); // Allow selection up to 2 years in future
  
  // Calculate minimum year based on start date or 2 years before current date
  const minYear = Math.min(
    startMonthDate.getFullYear(),
    currentDate.getFullYear() - 2
  );

  const totalMonths = differenceInMonths(currentMonthDate, startMonthDate) + 1;
  const unpaidMonths = totalMonths - selectedMonths.length;
  const pendingAmount = unpaidMonths * monthlyAmount;

  // Generate all months for the selected year
  const months = Array.from({ length: 12 }, (_, index) => {
    return new Date(selectedYear, index, 1);
  });

  const canSelectMonth = (date: Date) => {
    const monthStart = startOfMonth(date);
    // Allow selection of any month between min date and max date
    return (
      (isAfter(monthStart, startOfMonth(new Date(minYear, 0, 1))) || 
       isSameMonth(monthStart, startOfMonth(new Date(minYear, 0, 1)))) &&
      (isBefore(monthStart, maxDate) || isSameMonth(monthStart, maxDate))
    );
  };

  // Get the latest paid month for advance payment message
  const getLatestPaidMonth = () => {
    if (selectedMonths.length === 0) return null;
    const sortedMonths = [...selectedMonths].sort();
    const latestMonth = sortedMonths[sortedMonths.length - 1];
    return new Date(latestMonth);
  };

  const handleMonthClick = (e: React.MouseEvent, date: Date, isExempt: boolean = false) => {
    e.preventDefault();
    if (!canSelectMonth(date)) return;
    
    const monthKey = format(date, 'yyyy-MM');
    let newSelectedMonths: string[];
    let newExemptMonths: string[] = [...exemptMonths];

    // If month is already selected, remove it
    if (selectedMonths.includes(monthKey)) {
      newSelectedMonths = selectedMonths.filter(month => month !== monthKey);
      newExemptMonths = exemptMonths.filter(month => month !== monthKey);
    } else {
      // Only add if not already selected
      newSelectedMonths = [...selectedMonths, monthKey].sort();
      if (isExempt) {
        newExemptMonths = [...exemptMonths, monthKey].sort();
      }
    }

    onMonthsChange(newSelectedMonths, newExemptMonths);
  };

  const handleExemptClick = (e: React.MouseEvent, date: Date) => {
    e.preventDefault();
    if (!canSelectMonth(date)) return;
    
    const monthKey = format(date, 'yyyy-MM');
    
    // Toggle exempt status
    let newExemptMonths: string[];
    if (exemptMonths.includes(monthKey)) {
      newExemptMonths = exemptMonths.filter(month => month !== monthKey);
    } else {
      newExemptMonths = [...exemptMonths, monthKey].sort();
    }

    onMonthsChange(selectedMonths, newExemptMonths);
  };

  const handleYearChange = (increment: number) => {
    setSelectedYear(prev => prev + increment);
  };

  const latestPaidMonth = getLatestPaidMonth();
  const hasAdvancePayments = latestPaidMonth && isAfter(latestPaidMonth, currentMonthDate);

  const isMonthPaid = (date: Date) => {
    const monthKey = format(date, 'yyyy-MM');
    const payment = selectedMonths.find(m => m === monthKey);
    return !!payment;
  };

  const isMonthExempt = (date: Date) => {
    const monthKey = format(date, 'yyyy-MM');
    return exemptMonths.includes(monthKey);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleYearChange(-1)} 
              disabled={selectedYear <= minYear}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium min-w-[4rem] text-center">{selectedYear}</span>
            <button
              type="button"
              onClick={() => handleYearChange(1)}
              disabled={selectedYear >= maxDate.getFullYear()}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {selectedMonths.length} {t('workers.paidMonths')}
        </div>
      </div>
      
      {hasAdvancePayments && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            {t('kafalat.advancePaid', { 
              month: format(latestPaidMonth, 'MMMM yyyy')
            })}
          </p>
        </div>
      )}
      
      {unpaidMonths > 0 && (
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            {t('kafalat.pendingAmount')}: {formatCurrency(pendingAmount)}
          </p>
        </div>
      )}
      
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={(e) => handleMonthClick(e, currentDate, true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('workers.markAsExempt')}
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
        {months.map((date) => {
          const monthKey = format(date, 'yyyy-MM');
          const isPaid = isMonthPaid(date);
          const isExempt = isMonthExempt(date);
          const isSelectable = canSelectMonth(date);
          const isFutureMonth = isAfter(date, currentMonthDate);
          
          return (
            <div key={monthKey} className="relative">
              <button
                onClick={(e) => handleMonthClick(e, date)}
                type="button"
                disabled={!isSelectable}
                className={`
                  w-full p-2 rounded text-xs font-medium transition-all duration-200
                  ${isPaid 
                    ? isExempt
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      : isFutureMonth 
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    : isSelectable 
                      ? 'hover:bg-gray-100 text-gray-700' 
                      : 'opacity-50 cursor-not-allowed text-gray-400'}
                `}
                title={`${format(date, 'MMMM yyyy')}${isExempt ? ' (Exempt)' : ''}`}
              >
                {format(date, 'MMM')}
              </button>
              {isPaid && (
                <button
                  type="button"
                  onClick={(e) => handleExemptClick(e, date)}
                  className={`
                    absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs
                    ${isExempt 
                      ? 'bg-gray-500 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                  `}
                  title={isExempt ? 'Remove exempt status' : 'Mark as exempt'}
                >
                  E
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}