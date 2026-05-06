import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Save, X, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HorariosManagementProps {
  onBack: () => void;
}

interface HorarioCurso {
  id: number;
  nivel: string;
  curso: string;
  seccion?: string;
  order_index: number;
}

interface HorarioModulo {
  id: number;
  modulo_label: string;
  hora_inicio: string;
  hora_fin: string;
  order_index: number;
}

interface HorarioBloque {
  id?: number;
  curso_id: number;
  dia_semana: number;
  modulo_id: number;
  asignatura: string;
  hora_inicio?: string | null;
  hora_fin?: string | null;
}

const dias = [
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' }
];

const HorariosManagement: React.FC<HorariosManagementProps> = ({ onBack }) => {
  const [cursos, setCursos] = useState<HorarioCurso[]>([]);
  const [modulos, setModulos] = useState<HorarioModulo[]>([]);
  const [bloques, setBloques] = useState<HorarioBloque[]>([]);
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cursosRes, modulosRes, bloquesRes] = await Promise.all([
        supabase.from('horario_cursos').select('*').order('order_index', { ascending: true }),
        supabase.from('horario_modulos').select('*').order('order_index', { ascending: true }),
        supabase.from('horario_bloques').select('*')
      ]);

      if (cursosRes.error) throw cursosRes.error;
      if (modulosRes.error) throw modulosRes.error;
      if (bloquesRes.error) throw bloquesRes.error;

      const cursosData = cursosRes.data || [];
      setCursos(cursosData);
      setModulos(modulosRes.data || []);
      setBloques(bloquesRes.data || []);

      if (cursosData.length > 0) {
        setSelectedCursoId((prev) => prev ?? cursosData[0].id);
      }
    } catch (error) {
      console.error('Error fetching horarios data:', error);
      setMessage('Error al cargar los horarios');
    } finally {
      setLoading(false);
    }
  };

  const bloquesMap = useMemo(() => {
    const map = new Map<string, HorarioBloque>();
    for (const bloque of bloques) {
      map.set(`${bloque.curso_id}-${bloque.dia_semana}-${bloque.modulo_id}`, bloque);
    }
    return map;
  }, [bloques]);

  const cursoActual = useMemo(
    () => cursos.find((curso) => curso.id === selectedCursoId) || null,
    [cursos, selectedCursoId]
  );

  const getAsignatura = (cursoId: number, diaSemana: number, moduloId: number) => {
    return bloquesMap.get(`${cursoId}-${diaSemana}-${moduloId}`)?.asignatura || '';
  };

  const getHoraModuloCurso = (cursoId: number, modulo: HorarioModulo, field: 'hora_inicio' | 'hora_fin') => {
    const bloqueDia1 = bloquesMap.get(`${cursoId}-1-${modulo.id}`);
    const bloqueDia2 = bloquesMap.get(`${cursoId}-2-${modulo.id}`);
    const bloque = bloqueDia1 || bloqueDia2;
    return (bloque?.[field] as string | undefined | null) || (field === 'hora_inicio' ? modulo.hora_inicio : modulo.hora_fin);
  };

  const setAsignatura = (cursoId: number, diaSemana: number, moduloId: number, value: string) => {
    setBloques((prev) => {
      const index = prev.findIndex(
        (b) => b.curso_id === cursoId && b.dia_semana === diaSemana && b.modulo_id === moduloId
      );

      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], asignatura: value };
        return next;
      }

      return [...prev, { curso_id: cursoId, dia_semana: diaSemana, modulo_id: moduloId, asignatura: value }];
    });
  };

  const updateModuloHora = (cursoId: number, moduloId: number, field: 'hora_inicio' | 'hora_fin', value: string) => {
    setBloques((prev) => {
      let next = [...prev];

      for (const dia of dias) {
        const idx = next.findIndex(
          (b) => b.curso_id === cursoId && b.dia_semana === dia.id && b.modulo_id === moduloId
        );

        if (idx >= 0) {
          next[idx] = { ...next[idx], [field]: value };
        } else {
          next.push({
            curso_id: cursoId,
            dia_semana: dia.id,
            modulo_id: moduloId,
            asignatura: '',
            [field]: value
          });
        }
      }

      return next;
    });
  };

  const saveCursoHorario = async () => {
    if (!selectedCursoId) {
      setMessage('Selecciona un curso para guardar');
      return;
    }

    setSaving(true);
    try {
      const fullPayload = dias.flatMap((dia) =>
        modulos.map((modulo) => ({
          curso_id: selectedCursoId,
          dia_semana: dia.id,
          modulo_id: modulo.id,
          asignatura: getAsignatura(selectedCursoId, dia.id, modulo.id),
          hora_inicio: getHoraModuloCurso(selectedCursoId, modulo, 'hora_inicio'),
          hora_fin: getHoraModuloCurso(selectedCursoId, modulo, 'hora_fin')
        }))
      );

      const { error } = await supabase
        .from('horario_bloques')
        .upsert(fullPayload, { onConflict: 'curso_id,dia_semana,modulo_id' });

      if (error) throw error;

      setMessage(`Horario guardado para ${cursoActual?.curso || 'el curso seleccionado'} ${cursoActual?.seccion || 'A'}`);
      await fetchData();
    } catch (error) {
      console.error('Error saving course timetable:', error);
      setMessage('Error al guardar el horario del curso');
    } finally {
      setSaving(false);
    }
  };

  const formatHora = (hora: string) => hora?.slice(0, 5) || hora;

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Horarios</h1>
            <p className="text-gray-600">Selecciona un curso y edita su horario semanal.</p>
          </div>
          <button
            onClick={saveCursoHorario}
            disabled={saving || loading || !selectedCursoId}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-5 h-5" /> Guardar horario del curso
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Cargando cursos y horarios...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-6 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Curso</label>
                <select
                  value={selectedCursoId ?? ''}
                  onChange={(e) => setSelectedCursoId(Number(e.target.value))}
                  className="w-full rounded-lg border border-green-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {cursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.curso} {curso.seccion || 'A'} - {curso.nivel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600 bg-green-50 rounded-lg px-4 py-3 border border-green-100">
                Editando: <span className="font-bold text-green-800">{cursoActual?.curso || '-'} {cursoActual?.seccion || 'A'}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[980px] rounded-2xl border border-green-100 overflow-hidden">
                <div className="grid grid-cols-6 bg-gradient-to-r from-green-600 to-teal-600 text-white">
                  <div className="p-4 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Módulo
                  </div>
                  {dias.map((dia) => (
                    <div key={dia.id} className="p-4 font-bold text-center text-sm uppercase tracking-wide border-l border-white/20">
                      {dia.label}
                    </div>
                  ))}
                </div>

                {modulos.map((modulo, idx) => (
                  <div key={modulo.id} className={`grid grid-cols-6 ${idx % 2 === 0 ? 'bg-white' : 'bg-green-50/50'}`}>
                    <div className="p-4 border-t border-green-100">
                      <p className="font-bold text-gray-900 text-sm">{modulo.modulo_label}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wide">Inicio</label>
                          <input
                            type="time"
                            value={selectedCursoId ? formatHora(getHoraModuloCurso(selectedCursoId, modulo, 'hora_inicio')) : formatHora(modulo.hora_inicio)}
                            onChange={(e) => selectedCursoId && updateModuloHora(selectedCursoId, modulo.id, 'hora_inicio', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wide">Fin</label>
                          <input
                            type="time"
                            value={selectedCursoId ? formatHora(getHoraModuloCurso(selectedCursoId, modulo, 'hora_fin')) : formatHora(modulo.hora_fin)}
                            onChange={(e) => selectedCursoId && updateModuloHora(selectedCursoId, modulo.id, 'hora_fin', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    {dias.map((dia) => (
                      <div key={`${modulo.id}-${dia.id}`} className="p-2 border-t border-l border-green-100 min-h-[96px]">
                        {selectedCursoId ? (
                          <textarea
                            value={getAsignatura(selectedCursoId, dia.id, modulo.id)}
                            onChange={(e) => setAsignatura(selectedCursoId, dia.id, modulo.id, e.target.value)}
                            className="w-full h-full min-h-[80px] text-sm p-2 rounded-lg border border-green-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                            placeholder="Asignatura / actividad"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-gray-400">Selecciona curso</div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorariosManagement;
