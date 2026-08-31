import React, { useEffect, useMemo, useState } from 'react';
import { X, CalendarDays, UtensilsCrossed } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CasinoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuSettings {
  id: number;
  title: string;
  display_month: number;
  display_year: number;
  concessionaria_nombre: string | null;
  concessionaria_telefono: string | null;
  concessionaria_email: string | null;
  nutricionista_nombre: string | null;
  nutricionista_telefono: string | null;
}

interface MenuItem {
  id: number;
  menu_year: number;
  menu_month: number;
  menu_date: string;
  menu_text: string;
  price: number | null;
}

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getMondayOfWeek = (date: Date) => {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const CasinoModal: React.FC<CasinoModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<MenuSettings | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchMenu();
    }
  }, [isOpen]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const settingsRes = await supabase
        .from('casino_menu_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (settingsRes.error) throw settingsRes.error;

      const resolvedSettings = settingsRes.data || {
        id: 1,
        title: `Menú ${monthNames[new Date().getMonth()]} ${new Date().getFullYear()}`,
        display_month: new Date().getMonth() + 1,
        display_year: new Date().getFullYear(),
        concessionaria_nombre: null,
        concessionaria_telefono: null,
        concessionaria_email: null,
        nutricionista_nombre: null,
        nutricionista_telefono: null
      };

      setSettings(resolvedSettings);

      const itemsRes = await supabase
        .from('casino_menu_items')
        .select('*')
        .eq('menu_year', resolvedSettings.display_year)
        .eq('menu_month', resolvedSettings.display_month)
        .order('menu_date', { ascending: true });

      if (itemsRes.error) throw itemsRes.error;
      setItems(itemsRes.data || []);
    } catch (error) {
      console.error('Error fetching casino menu calendar:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const calendarWeeks = useMemo(() => {
    if (!settings) return [] as Array<Array<Date | null>>;

    const first = new Date(settings.display_year, settings.display_month - 1, 1);
    const last = new Date(settings.display_year, settings.display_month, 0);
    const firstVisible = getMondayOfWeek(first);
    const finalDay = new Date(last.getFullYear(), last.getMonth(), last.getDate(), 23, 59, 59, 999);

    const weeks: Array<Array<Date | null>> = [];
    const cursor = new Date(firstVisible);

    while (cursor <= finalDay || weeks.length === 0) {
      const week: Array<Date | null> = [];

      for (let i = 0; i < 7; i += 1) {
        const day = new Date(cursor);
        const isCurrentMonth = day.getMonth() === first.getMonth();
        week.push(isCurrentMonth ? day : null);
        cursor.setDate(cursor.getDate() + 1);
      }

      weeks.push(week);

      if (cursor > finalDay && weeks.length > 0) {
        break;
      }
    }

    return weeks;
  }, [settings]);

  const menuByDate = useMemo(() => {
    const map = new Map<string, MenuItem>();
    for (const item of items) {
      map.set(item.menu_date, item);
    }
    return map;
  }, [items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-2 md:px-4 py-4 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-900/75" onClick={onClose}></div>

        <div className="relative inline-block w-full max-w-7xl text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UtensilsCrossed className="w-7 h-7 text-white" />
              <h2 className="text-xl md:text-2xl font-bold text-white">Menú Casino</h2>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 md:p-6 bg-slate-50">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-600"></div>
              </div>
            ) : settings ? (
              <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-lg">
                <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-100/90 mb-2">Mes visible</p>
                    <div className="flex items-center gap-3 mb-2">
                      <CalendarDays className="w-8 h-8" />
                      <h3 className="text-3xl font-bold">{monthNames[settings.display_month - 1]} {settings.display_year}</h3>
                    </div>
                    <h4 className="text-xl font-semibold text-white/95">{settings.title || `Menú ${monthNames[settings.display_month - 1]} ${settings.display_year}`}</h4>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[980px]">
                    <div className="grid grid-cols-7 bg-blue-50 border-b border-blue-200">
                      {days.map((day) => (
                        <div key={day} className="py-3 px-2 text-center font-bold text-blue-800 border-r border-blue-200 last:border-r-0">
                          {day}
                        </div>
                      ))}
                    </div>

                    {calendarWeeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-cols-7 border-b border-blue-100 last:border-b-0">
                        {week.map((date, dayIdx) => {
                          if (!date) {
                            return <div key={`${weekIndex}-${dayIdx}`} className="min-h-[180px] border-r border-blue-100 last:border-r-0 bg-slate-50"></div>;
                          }

                          const dateKey = formatDateKey(date);
                          const item = menuByDate.get(dateKey);
                          const isCurrentMonth = date.getMonth() === settings.display_month - 1;

                          return (
                            <div key={dateKey} className={`min-h-[180px] border-r border-blue-100 last:border-r-0 p-3 ${isCurrentMonth ? 'bg-white' : 'bg-slate-50 text-slate-400'}`}>
                              <p className="font-bold mb-2 text-blue-800 text-lg">{`${date.getDate()}`.padStart(2, '0')}</p>
                              <div className="text-sm leading-relaxed whitespace-pre-line">
                                {item?.menu_text || ''}
                              </div>
                              {item?.price != null && (
                                <p className="text-base font-bold text-gray-800 mt-3">{item.price}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-950 text-white px-6 py-4 grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-bold text-lg">Concesionaria</p>
                    <p>{settings.concessionaria_nombre || '-'}</p>
                    <p>Cel: {settings.concessionaria_telefono || '-'}</p>
                    <p>Mail: {settings.concessionaria_email || '-'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Nutricionista</p>
                    <p>{settings.nutricionista_nombre || '-'}</p>
                    <p>Cel: {settings.nutricionista_telefono || '-'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">No hay menú disponible en este momento</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoModal;
