import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HorarioModulo {
  id: number;
  modulo_label: string;
  hora_inicio: string;
  hora_fin: string;
  order_index: number;
}

interface HorarioCurso {
  id: number;
  nivel: string;
  curso: string;
  order_index: number;
}

interface HorarioBloque {
  id: number;
  curso_id: number;
  dia_semana: number;
  modulo_id: number;
  asignatura: string;
  hora_inicio?: string | null;
  hora_fin?: string | null;
}

interface HorariosSectionProps {
  onBack: () => void;
}

const HorariosSection: React.FC<HorariosSectionProps> = ({ onBack }) => {
  const [modulos, setModulos] = useState<HorarioModulo[]>([]);
  const [cursos, setCursos] = useState<HorarioCurso[]>([]);
  const [bloques, setBloques] = useState<HorarioBloque[]>([]);
  const [cursoActivoId, setCursoActivoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const dias = [
    { id: 1, label: 'Lunes' },
    { id: 2, label: 'Martes' },
    { id: 3, label: 'Miércoles' },
    { id: 4, label: 'Jueves' },
    { id: 5, label: 'Viernes' }
  ];

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    setLoading(true);
    try {
      const [modulosRes, cursosRes, bloquesRes] = await Promise.all([
        supabase
          .from('horario_modulos')
          .select('*')
          .order('order_index', { ascending: true }),
        supabase
          .from('horario_cursos')
          .select('*')
          .order('order_index', { ascending: true }),
        supabase
          .from('horario_bloques')
          .select('*')
      ]);

      if (modulosRes.error) throw modulosRes.error;
      if (cursosRes.error) throw cursosRes.error;
      if (bloquesRes.error) throw bloquesRes.error;

      setModulos(modulosRes.data || []);
      const cursosData = cursosRes.data || [];
      setCursos(cursosData);
      if (cursosData.length > 0) {
        setCursoActivoId((prev) => prev ?? cursosData[0].id);
      }
      setBloques(bloquesRes.data || []);
    } catch (error) {
      console.error('Error fetching horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const bloquesMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const bloque of bloques) {
      map.set(`${bloque.curso_id}-${bloque.dia_semana}-${bloque.modulo_id}`, bloque.asignatura || '');
    }
    return map;
  }, [bloques]);

  const getBloque = (cursoId: number, diaSemana: number, moduloId: number) => {
    return bloquesMap.get(`${cursoId}-${diaSemana}-${moduloId}`) || '';
  };

  const formatHora = (hora: string) => hora?.slice(0, 5) || hora;

  const getHoraModuloCurso = (cursoId: number, modulo: HorarioModulo, field: 'hora_inicio' | 'hora_fin') => {
    const bloqueDia1 = bloques.find(
      (b) => b.curso_id === cursoId && b.dia_semana === 1 && b.modulo_id === modulo.id
    );
    const bloqueDia2 = bloques.find(
      (b) => b.curso_id === cursoId && b.dia_semana === 2 && b.modulo_id === modulo.id
    );
    const bloque = bloqueDia1 || bloqueDia2;
    return (bloque?.[field] as string | null | undefined) || (field === 'hora_inicio' ? modulo.hora_inicio : modulo.hora_fin);
  };

  const cursoActivo = cursos.find((c) => c.id === cursoActivoId) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Botón Volver */}
        <button
          onClick={onBack}
          className="flex items-center text-green-600 hover:text-green-700 transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </button>

        {/* Encabezado */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Horarios Escolares
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Consulta y revisa los módulos de clases en formato calendario por nivel
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Cargando calendario de horarios...</p>
          </div>
        ) : modulos.length > 0 && cursos.length > 0 && cursoActivoId != null ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-t-4 border-green-500">
            <div className="mb-6 grid md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Curso</label>
                <select
                  value={cursoActivoId}
                  onChange={(e) => setCursoActivoId(Number(e.target.value))}
                  className="w-full rounded-lg border border-green-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {cursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.curso} - {curso.nivel}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600 bg-green-50 rounded-lg px-4 py-3 border border-green-100">
                Mostrando horario de: <span className="font-bold text-green-800">{cursoActivo?.curso || '-'}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[980px] rounded-2xl border border-green-100 overflow-hidden">
                <div className="grid grid-cols-6 bg-gradient-to-r from-green-600 to-teal-600 text-white">
                  <div className="p-4 font-bold text-sm uppercase tracking-wide">Módulo</div>
                  {dias.map((dia) => (
                    <div key={dia.id} className="p-4 font-bold text-center text-sm uppercase tracking-wide border-l border-white/20">
                      {dia.label}
                    </div>
                  ))}
                </div>

                {modulos.map((modulo, index) => (
                  <div key={modulo.id} className={`grid grid-cols-6 ${index % 2 === 0 ? 'bg-white' : 'bg-green-50/50'}`}>
                    <div className="p-4 border-t border-green-100">
                      <p className="font-bold text-gray-900 text-sm">{modulo.modulo_label}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatHora(getHoraModuloCurso(cursoActivoId, modulo, 'hora_inicio'))} - {formatHora(getHoraModuloCurso(cursoActivoId, modulo, 'hora_fin'))}
                      </p>
                    </div>
                    {dias.map((dia) => (
                      <div key={`${modulo.id}-${dia.id}`} className="p-3 border-t border-l border-green-100 min-h-[96px]">
                        <div className="rounded-lg bg-white/80 border border-green-100 h-full p-2">
                          <p className="text-sm text-gray-700 leading-snug whitespace-pre-line">
                            {getBloque(cursoActivoId, dia.id, modulo.id) || '---'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
              <p className="text-gray-700 text-sm md:text-base">
                Este calendario es referencial y puede ser ajustado por coordinación académica según actividades institucionales.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No hay horarios configurados en este momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorariosSection;
