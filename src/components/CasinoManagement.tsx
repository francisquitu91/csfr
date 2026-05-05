import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ArrowLeft, Save, X, UtensilsCrossed, CalendarDays, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CasinoManagementProps {
  onBack: () => void;
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
  id?: number;
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

const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const generateWeekdays = (month: number, year: number) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  const result: string[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day >= 1 && day <= 5) {
      result.push(formatDateKey(d));
    }
  }

  return result;
};

const CasinoManagement: React.FC<CasinoManagementProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<MenuSettings>({
    id: 1,
    title: `Menú ${monthNames[new Date().getMonth()]} ${new Date().getFullYear()}`,
    display_month: new Date().getMonth() + 1,
    display_year: new Date().getFullYear(),
    concessionaria_nombre: '',
    concessionaria_telefono: '',
    concessionaria_email: '',
    nutricionista_nombre: '',
    nutricionista_telefono: ''
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-save effect for settings changes
  const autoSaveSettings = useCallback(async (settingsToSave: MenuSettings) => {
    try {
      const payload = {
        id: 1,
        title: settingsToSave.title,
        display_month: settingsToSave.display_month,
        display_year: settingsToSave.display_year,
        concessionaria_nombre: settingsToSave.concessionaria_nombre || null,
        concessionaria_telefono: settingsToSave.concessionaria_telefono || null,
        concessionaria_email: settingsToSave.concessionaria_email || null,
        nutricionista_nombre: settingsToSave.nutricionista_nombre || null,
        nutricionista_telefono: settingsToSave.nutricionista_telefono || null
      };

      const { error } = await supabase
        .from('casino_menu_settings')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('Auto-save error:', error);
      }
    } catch (error) {
      console.error('Error in auto-save:', error);
    }
  }, []);

  const handleSettingsChange = useCallback((newSettings: MenuSettings) => {
    setSettings(newSettings);
    
    // Clear previous timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new timeout for auto-save after 1.5 seconds
    const timeout = setTimeout(() => {
      autoSaveSettings(newSettings);
    }, 1500);

    setAutoSaveTimeout(timeout);
  }, [autoSaveTimeout, autoSaveSettings]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const settingsRes = await supabase
        .from('casino_menu_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (settingsRes.error && settingsRes.error.code !== 'PGRST116') throw settingsRes.error;

      const resolvedSettings = settingsRes.data || settings;
      setSettings(resolvedSettings);

      const itemsRes = await supabase
        .from('casino_menu_items')
        .select('*')
        .eq('menu_year', resolvedSettings.display_year)
        .eq('menu_month', resolvedSettings.display_month)
        .order('menu_date', { ascending: true });

      if (itemsRes.error) throw itemsRes.error;
      setMenuItems(itemsRes.data || []);
    } catch (error) {
      console.error('Error fetching casino calendar data:', error);
      setMessage('Error al cargar el menú editable');
    } finally {
      setLoading(false);
    }
  };

  const sortedItems = useMemo(
    () => [...menuItems].sort((a, b) => (a.menu_date > b.menu_date ? 1 : -1)),
    [menuItems]
  );

  const loadMonthItems = async (month: number, year: number) => {
    const { data, error } = await supabase
      .from('casino_menu_items')
      .select('*')
      .eq('menu_year', year)
      .eq('menu_month', month)
      .order('menu_date', { ascending: true });

    if (error) throw error;
    setMenuItems(data || []);
  };

  const handleGenerateWorkdays = async () => {
    try {
      const dates = generateWeekdays(settings.display_month, settings.display_year);
      const existing = new Set(menuItems.map((item) => item.menu_date));

      const missing = dates
        .filter((date) => !existing.has(date))
        .map((date) => ({
          menu_year: settings.display_year,
          menu_month: settings.display_month,
          menu_date: date,
          menu_text: '',
          price: null
        }));

      if (missing.length > 0) {
        const { error } = await supabase.from('casino_menu_items').insert(missing);
        if (error) throw error;
      }

      await loadMonthItems(settings.display_month, settings.display_year);
      setMessage('Días hábiles generados correctamente');
    } catch (error) {
      console.error('Error generating workdays:', error);
      setMessage('Error al generar días hábiles');
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const payload = {
        id: 1,
        title: settings.title,
        display_month: settings.display_month,
        display_year: settings.display_year,
        concessionaria_nombre: settings.concessionaria_nombre || null,
        concessionaria_telefono: settings.concessionaria_telefono || null,
        concessionaria_email: settings.concessionaria_email || null,
        nutricionista_nombre: settings.nutricionista_nombre || null,
        nutricionista_telefono: settings.nutricionista_telefono || null
      };

      const { error } = await supabase
        .from('casino_menu_settings')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      await loadMonthItems(settings.display_month, settings.display_year);
      setMessage('✓ Configuración del menú guardada correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('❌ Error al guardar la configuración. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveItems = async () => {
    setSaving(true);
    try {
      const payload = sortedItems.map((item) => ({
        id: item.id,
        menu_year: settings.display_year,
        menu_month: settings.display_month,
        menu_date: item.menu_date,
        menu_text: item.menu_text || '',
        price: item.price ?? null
      }));

      const { error } = await supabase
        .from('casino_menu_items')
        .upsert(payload, { onConflict: 'menu_year,menu_month,menu_date' });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      await loadMonthItems(settings.display_month, settings.display_year);
      setMessage('✓ Calendario de menú guardado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving menu items:', error);
      setMessage('❌ Error al guardar los días del menú. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (!item.id) return;
    try {
      const { error } = await supabase
        .from('casino_menu_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      setMenuItems((prev) => prev.filter((i) => i.id !== item.id));
      setMessage('✓ Día eliminado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting item:', error);
      setMessage('❌ Error al eliminar el día. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al panel de administración
        </button>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <UtensilsCrossed className="w-10 h-10 text-orange-600" /> Gestión de Menú Casino
            </h1>
            <p className="text-gray-600">Calendario editable mensual, sin subir Word/PDF.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSaveSettings}
              disabled={saving || loading}
              className="bg-orange-600 text-white px-5 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-5 h-5" /> Guardar configuración
            </button>
            <button
              onClick={handleSaveItems}
              disabled={saving || loading}
              className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-5 h-5" /> Guardar calendario
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 border rounded-lg flex items-center justify-between ${
            message.includes('❌') 
              ? 'bg-red-100 border-red-400 text-red-700' 
              : 'bg-green-100 border-green-400 text-green-700'
          }`}>
            <span>{message}</span>
            <button onClick={() => setMessage('')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Cargando menú editable...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-orange-600" /> Configuración General
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <label className="block text-sm text-gray-600 mb-1">Título</label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => handleSettingsChange({ ...settings, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1">Mes visible</label>
                  <select
                    value={settings.display_month}
                    onChange={async (e) => {
                      const month = Number(e.target.value);
                      const newSettings = { ...settings, display_month: month };
                      handleSettingsChange(newSettings);
                      await loadMonthItems(month, settings.display_year);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {monthNames.map((month, idx) => (
                      <option key={month} value={idx + 1}>{month}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Año</label>
                  <input
                    type="number"
                    value={settings.display_year}
                    onChange={async (e) => {
                      const year = Number(e.target.value);
                      const newSettings = { ...settings, display_year: year };
                      handleSettingsChange(newSettings);
                      if (!Number.isNaN(year) && year > 1990) {
                        await loadMonthItems(settings.display_month, year);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Acción</label>
                  <button
                    onClick={handleGenerateWorkdays}
                    className="w-full px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Generar días
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Concesionaria nombre</label>
                  <input
                    type="text"
                    value={settings.concessionaria_nombre || ''}
                    onChange={(e) => handleSettingsChange({ ...settings, concessionaria_nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Concesionaria teléfono</label>
                  <input
                    type="text"
                    value={settings.concessionaria_telefono || ''}
                    onChange={(e) => handleSettingsChange({ ...settings, concessionaria_telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Concesionaria correo</label>
                  <input
                    type="email"
                    value={settings.concessionaria_email || ''}
                    onChange={(e) => handleSettingsChange({ ...settings, concessionaria_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nutricionista nombre</label>
                  <input
                    type="text"
                    value={settings.nutricionista_nombre || ''}
                    onChange={(e) => handleSettingsChange({ ...settings, nutricionista_nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nutricionista teléfono</label>
                  <input
                    type="text"
                    value={settings.nutricionista_telefono || ''}
                    onChange={(e) => handleSettingsChange({ ...settings, nutricionista_telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-5">Días del Menú ({monthNames[settings.display_month - 1]} {settings.display_year})</h2>

              <div className="space-y-4">
                {sortedItems.length > 0 ? (
                  sortedItems.map((item) => (
                    <div key={item.menu_date} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">Fecha</label>
                          <input
                            type="date"
                            value={item.menu_date}
                            onChange={(e) => setMenuItems((prev) => prev.map((it) => it.menu_date === item.menu_date ? { ...it, menu_date: e.target.value } : it))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-8">
                          <label className="block text-sm text-gray-600 mb-1">Contenido (usa Enter para separar líneas)</label>
                          <textarea
                            value={item.menu_text}
                            onChange={(e) => setMenuItems((prev) => prev.map((it) => it.menu_date === item.menu_date ? { ...it, menu_text: e.target.value } : it))}
                            className="w-full min-h-[92px] px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder={'Salad Bar\nPlato principal\nPostre'}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm text-gray-600 mb-1">Precio</label>
                          <input
                            type="number"
                            value={item.price ?? ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              setMenuItems((prev) => prev.map((it) =>
                                it.menu_date === item.menu_date
                                  ? { ...it, price: value === '' ? null : Number(value) }
                                  : it
                              ));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end">
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="w-full px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay días para este mes. Usa Generar días.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CasinoManagement;
