import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  Printer,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  User,
  CreditCard,
  Mail,
  Phone,
  LogOut,
  Calendar,
  X,
  RefreshCw,
  ChevronRight,
  Info
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const CONCEPT_LABELS = {
  uniforme: 'Pago de Uniforme',
  examen: 'Pago de Examen',
  inscripcion: 'Pago de Inscripción',
  reinscripcion: 'Pago de Reinscripción',
  practica: 'Pago de Práctica Clínica',
  credencial: 'Pago de Credencial',
  periodo: 'Pago de Mensualidad/Periodo'
};

const CONCEPT_OPTIONS = [
  { value: 'periodo', label: 'Mensualidad / Periodo' },
  { value: 'inscripcion', label: 'Inscripción' },
  { value: 'reinscripcion', label: 'Reinscripción' },
  { value: 'uniforme', label: 'Uniforme' },
  { value: 'examen', label: 'Examen' },
  { value: 'practica', label: 'Práctica Clínica' },
  { value: 'credencial', label: 'Credencial' }
];

const METODO_OPTIONS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'tarjeta', label: 'Tarjeta Bancaria' }
];

const ESTADO_OPTIONS = [
  { value: 'pagado', label: 'Pagado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'parcial', label: 'Pago Parcial' },
  { value: 'cancelado', label: 'Cancelado' }
];

const ROL_STYLES = {
  pagado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  parcial: 'bg-blue-100 text-blue-700 border-blue-200',
  cancelado: 'bg-red-100 text-red-700 border-red-200'
};

function getAuthHeaders() {
  const token = localStorage.getItem('iar_token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value);
}

function formatDate(value) {
  if (!value) return '—';
  const cleanDate = value.split('T')[0]; // Formato YYYY-MM-DD
  const parts = cleanDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
  }
  return value;
}

export default function Contador({ allowedRole = 'contador' }) {
  const navigate = useNavigate();
  const printAreaRef = useRef();

  // Estados de datos
  const [pagos, setPagos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [stats, setStats] = useState({
    totalDia: 0,
    totalSemana: 0,
    totalMes: 0,
    totalPendiente: 0,
    alumnosAdeudo: 0,
    ultimosPagos: []
  });
  const [graficaData, setGraficaData] = useState([]);
  
  // Estados de interfaz y filtros
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, pagos
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterFechaInicio, setFilterFechaInicio] = useState('');
  const [filterFechaFin, setFilterFechaFin] = useState('');

  // Estados de Modales
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPago, setEditingPago] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);

  // Formulario del Modal
  const [formPayload, setFormPayload] = useState({
    isManual: false,
    usuario_id: '',
    alumno_nombre: '',
    matricula: '',
    tipo: 'periodo',
    monto: '',
    fecha_pago: new Date().toISOString().split('T')[0],
    estado: 'pagado',
    metodo_pago: 'efectivo',
    observaciones: ''
  });

  // Datos del usuario firmado
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('iar_user') || 'null');
      if (!user || user.rol !== allowedRole) {
        navigate('/no-encontrada');
        return;
      }
      setCurrentUser(user);
    } catch {
      navigate('/no-encontrada');
    }

    loadAllData();
  }, [navigate]);

  // Carga de todos los datos desde el servidor
  async function loadAllData() {
    setLoading(true);
    try {
      await Promise.all([
        loadStatsAndCharts(),
        loadPagos(),
        loadEstudiantes()
      ]);
    } catch (error) {
      console.error('Error al cargar datos generales:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStatsAndCharts() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pagos/stats`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok) {
        if (data.stats) setStats(data.stats);
        if (data.grafica) {
          // Completar meses vacíos si es necesario o cargar directamente
          setGraficaData(data.grafica);
        }
      }
    } catch (e) {
      console.error('Error cargando estadísticas', e);
    }
  }

  async function loadPagos() {
    try {
      // Construir query string de filtros
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterTipo) params.append('tipo', filterTipo);
      if (filterEstado) params.append('estado', filterEstado);
      if (filterFechaInicio) params.append('fechaInicio', filterFechaInicio);
      if (filterFechaFin) params.append('fechaFin', filterFechaFin);

      const res = await fetch(`${API_BASE_URL}/api/pagos?${params.toString()}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok) {
        setPagos(data.pagos || []);
      }
    } catch (e) {
      console.error('Error cargando historial de pagos', e);
    }
  }

  async function loadEstudiantes() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/estudiantes`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok) {
        // Filtrar solo los que tengan rol 'estudiante'
        const listaEstudiantes = (data.users || []).filter(u => u.rol === 'estudiante');
        setEstudiantes(listaEstudiantes);
      }
    } catch (e) {
      console.error('Error cargando estudiantes', e);
    }
  }

  // Buscar pagos aplicando los filtros del frontend reactivo al escribir
  useEffect(() => {
    const handler = setTimeout(() => {
      loadPagos();
    }, 300); // Debounce
    return () => clearTimeout(handler);
  }, [search, filterTipo, filterEstado, filterFechaInicio, filterFechaFin]);

  function handleLogout() {
    localStorage.removeItem('iar_token');
    localStorage.removeItem('iar_user');
    navigate('/login_docentes', { replace: true });
  }

  // Abrir Modal de creación
  function openCreateModal() {
    setEditingPago(null);
    setFormPayload({
      isManual: false,
      usuario_id: '',
      alumno_nombre: '',
      matricula: '',
      tipo: 'periodo',
      monto: '',
      fecha_pago: new Date().toISOString().split('T')[0],
      estado: 'pagado',
      metodo_pago: 'efectivo',
      observaciones: ''
    });
    setModalOpen(true);
  }

  // Abrir Modal de edición
  function openEditModal(pago) {
    setEditingPago(pago);
    setFormPayload({
      isManual: !pago.usuario_id,
      usuario_id: pago.usuario_id || '',
      alumno_nombre: pago.alumno_nombre || '',
      matricula: pago.matricula || '',
      tipo: pago.tipo,
      monto: pago.monto,
      fecha_pago: pago.fecha_pago.split('T')[0],
      estado: pago.estado,
      metodo_pago: pago.metodo_pago,
      observaciones: pago.observaciones || ''
    });
    setModalOpen(true);
  }

  // Guardar nuevo o cambios de pago
  async function handleSavePago(e, bypass = false) {
    e.preventDefault();
    
    // Validaciones
    if (!formPayload.isManual && !formPayload.usuario_id) {
      Swal.fire('Error de validación', 'Debes seleccionar un alumno registrado o activar la captura manual.', 'warning');
      return;
    }

    if (formPayload.isManual && (!formPayload.alumno_nombre || formPayload.alumno_nombre.trim() === '')) {
      Swal.fire('Error de validación', 'Debes escribir el nombre completo del alumno.', 'warning');
      return;
    }

    const valMonto = Number(formPayload.monto);
    if (isNaN(valMonto) || valMonto <= 0) {
      Swal.fire('Error de validación', 'El monto debe ser un número positivo mayor que cero.', 'warning');
      return;
    }

    if (!formPayload.fecha_pago) {
      Swal.fire('Error de validación', 'La fecha de registro del pago es obligatoria.', 'warning');
      return;
    }

    let resolvedNombre = formPayload.alumno_nombre;
    let resolvedMatricula = formPayload.matricula;

    if (!formPayload.isManual) {
      const selectedEst = estudiantes.find(est => Number(est.id) === Number(formPayload.usuario_id));
      if (selectedEst) {
        resolvedNombre = `${selectedEst.nombre} ${selectedEst.apellido}`;
        resolvedMatricula = selectedEst.matricula;
      }
    }

    const payload = {
      usuario_id: formPayload.isManual ? null : Number(formPayload.usuario_id),
      alumno_nombre: resolvedNombre,
      matricula: resolvedMatricula || null,
      tipo: formPayload.tipo,
      monto: valMonto,
      fecha_pago: formPayload.fecha_pago,
      estado: formPayload.estado,
      metodo_pago: formPayload.metodo_pago,
      observaciones: formPayload.observaciones,
      bypass_duplicate: bypass
    };

    try {
      const url = editingPago
        ? `${API_BASE_URL}/api/pagos/${editingPago.id}`
        : `${API_BASE_URL}/api/pagos`;
      
      const response = await fetch(url, {
        method: editingPago ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.status === 409 && data.isDuplicate) {
        // Alerta inteligente de duplicados con opción a forzar guardado
        const doubleCheck = await Swal.fire({
          icon: 'warning',
          title: '¿Pago duplicado?',
          text: data.message,
          showCancelButton: true,
          confirmButtonText: 'Sí, registrar de todos modos',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#E07B00'
        });

        if (doubleCheck.isConfirmed) {
          // Re-enviar con bypass
          handleSavePago(e, true);
        }
        return;
      }

      if (!response.ok) throw new Error(data.message || 'No fue posible guardar el registro de pago.');

      setModalOpen(false);
      await loadAllData();

      Swal.fire({
        icon: 'success',
        title: editingPago ? 'Pago actualizado' : 'Pago registrado',
        text: editingPago 
          ? 'El pago ha sido modificado exitosamente.'
          : `Pago guardado correctamente. Folio generado: ${data.pago.folio}`,
        showDenyButton: !editingPago,
        denyButtonText: 'Imprimir Recibo',
        denyButtonColor: '#E8A800',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1A9E96'
      }).then((result) => {
        if (result.isDenied) {
          handleOpenPrint(data.pago);
        }
      });

    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }

  // Cancelación formal de un pago
  async function handleCancelPago(pago) {
    const { value: observaciones } = await Swal.fire({
      icon: 'warning',
      title: 'Cancelar pago',
      text: `¿Estás seguro de cancelar el pago con folio ${pago.folio} por ${formatCurrency(pago.monto)}?`,
      input: 'text',
      inputPlaceholder: 'Escribe el motivo de la cancelación...',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes escribir un motivo para justificar la cancelación del folio.';
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar pago',
      cancelButtonText: 'Regresar',
      confirmButtonColor: '#d33'
    });

    if (!observaciones) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/pagos/${pago.id}/cancelar`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ observaciones })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No fue posible procesar la cancelación.');

      await loadAllData();
      Swal.fire('Cancelado', 'El pago ha sido marcado como cancelado y los montos estadísticos fueron actualizados.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }

  function handleOpenDetails(pago) {
    setSelectedPago(pago);
    setDetailsOpen(true);
  }

  function handleOpenPrint(pago) {
    setSelectedPago(pago);
    setPrintOpen(true);
  }

  function triggerPrint() {
    window.print();
  }

  // Selector dinámico para autocompletar matrícula si se elige un estudiante en el modal
  function handleStudentSelect(e) {
    const userId = e.target.value;
    const est = estudiantes.find(st => Number(st.id) === Number(userId));
    if (est) {
      setFormPayload(prev => ({
        ...prev,
        usuario_id: userId,
        alumno_nombre: `${est.nombre} ${est.apellido}`,
        matricula: est.matricula || ''
      }));
    } else {
      setFormPayload(prev => ({
        ...prev,
        usuario_id: '',
        alumno_nombre: '',
        matricula: ''
      }));
    }
  }

  // Filtrar adeudos críticos (pagos pendientes o parciales)
  const adeudosCriticos = useMemo(() => {
    return pagos.filter(p => p.estado === 'pendiente' || p.estado === 'parcial').slice(0, 5);
  }, [pagos]);

  return (
    <>
      {/* ── SECCIÓN PARA IMPRESIÓN EXTERNA (Solo visible en print) ── */}
      {printOpen && selectedPago && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-8 z-50 text-xs font-mono leading-relaxed" ref={printAreaRef}>
          <div className="border border-neutral-300 rounded-xl p-6 max-w-xl mx-auto space-y-6">
            
            {/* Header del Recibo */}
            <div className="flex justify-between items-start border-b pb-4 border-dashed border-neutral-300">
              <div>
                <h1 className="text-sm font-bold uppercase tracking-wider">Instituto Alfonso Reyes</h1>
                <p className="text-[10px] text-neutral-500">Periférico Sur Poniente No. 1952</p>
                <p className="text-[10px] text-neutral-500">Col. Penipak, Tuxtla Gutiérrez, Chis.</p>
                <p className="text-[10px] text-neutral-500">Tel: 961-612-1115</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold">RECIBO DE PAGO</p>
                <p className="text-sm font-bold text-red-600 mt-1">{selectedPago.folio}</p>
                <p className="text-[9px] text-neutral-400 mt-0.5">Fecha: {formatDate(selectedPago.fecha_pago)}</p>
              </div>
            </div>

            {/* Datos del Alumno */}
            <div className="grid grid-cols-2 gap-4 text-[10px]">
              <div>
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest">ALUMNO / CLIENTE</p>
                <p className="font-bold text-[11px]">{selectedPago.alumno_nombre}</p>
                {selectedPago.matricula && (
                  <p className="text-[10px] text-neutral-600">Matrícula: {selectedPago.matricula}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[9px] text-neutral-400 uppercase tracking-widest">DETALLES DE OPERACIÓN</p>
                <p className="font-bold">Método: <span className="capitalize">{selectedPago.metodo_pago}</span></p>
                <p className="text-[10px] text-neutral-600">Estatus: <span className="uppercase font-bold text-emerald-600">{selectedPago.estado}</span></p>
              </div>
            </div>

            {/* Tabla del Desglose */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200">
                    <th className="px-3 py-2 text-left">Concepto</th>
                    <th className="px-3 py-2 text-right">Monto Neto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-100 last:border-0">
                    <td className="px-3 py-2 text-left font-semibold">
                      {CONCEPT_LABELS[selectedPago.tipo] || selectedPago.tipo}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold">
                      {formatCurrency(selectedPago.monto)}
                    </td>
                  </tr>
                  <tr className="bg-neutral-50 border-t border-dashed">
                    <td className="px-3 py-2 text-right font-bold text-neutral-500">TOTAL APAGADO:</td>
                    <td className="px-3 py-2 text-right font-extrabold text-[12px]">
                      {formatCurrency(selectedPago.monto)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Observaciones */}
            {selectedPago.observaciones && (
              <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                <p className="text-[8px] text-neutral-400 uppercase tracking-widest">Notas / Observaciones internas</p>
                <p className="text-[9px] text-neutral-600 mt-0.5 leading-relaxed">{selectedPago.observaciones}</p>
              </div>
            )}

            {/* Firmas y Sello */}
            <div className="grid grid-cols-2 gap-8 pt-8 text-[9px] text-center border-t border-dashed border-neutral-200">
              <div className="flex flex-col items-center justify-end">
                <div className="w-32 border-b border-neutral-400 mb-1" />
                <p className="text-neutral-400">Firma del Alumno</p>
              </div>
              <div className="flex flex-col items-center justify-end">
                <div className="w-32 border-b border-neutral-400 mb-1" />
                <p className="text-neutral-600 font-bold">{currentUser?.nombre} {currentUser?.apellido}</p>
                <p className="text-neutral-400">Contraloría / Caja</p>
              </div>
            </div>
            {/* Footer Recibo */}
            <div className="text-center pt-2 text-[8px] text-neutral-400">
              <p>Este es un comprobante digital generado automáticamente.</p>
              <p>Gracias por realizar su pago puntualmente.</p>
            </div>

          </div>
        </div>
      )}

      {/* ── VISTA PRINCIPAL (ERP) ── */}
      <div className="min-h-screen bg-neutral-light print:hidden">

        {/* ── HEADER ─────────────────────────────────── */}
        <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-semibold mb-1">
                Panel de Contabilidad
              </p>
              <h1 className="text-2xl md:text-3xl font-bold">Contador / Caja General</h1>
              <p className="text-sm text-white/60 mt-1">
                Administración y control de todos los pagos relacionados con los alumnos.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadAllData}
                disabled={loading}
                className="p-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                title="Sincronizar datos"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-orange hover:bg-orange-600 text-white font-bold text-xs px-4 py-3 shadow-soft active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <Plus size={15} />
                Registrar Pago
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-3 transition-colors"
              >
                <LogOut size={15} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* ── NAV TABS ────────────────────────────────── */}
        <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex gap-1 overflow-x-auto" aria-label="Secciones del panel">
              {[
                { id: 'dashboard', label: 'Dashboard Financiero', icon: TrendingUp },
                { id: 'pagos', label: 'Control de Pagos', icon: DollarSign }
              ].map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`
                      inline-flex items-center gap-2 px-4 py-4 text-sm font-semibold whitespace-nowrap
                      border-b-2 transition-colors
                      ${isActive
                        ? 'border-primary-main text-primary-main'
                        : 'border-transparent text-neutral-dark/50 hover:text-neutral-dark hover:border-neutral-300'
                      }
                    `}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* INDICADOR DE CARGANDO GENERAL */}
          {loading && (
            <div className="bg-white/80 border border-neutral-200 rounded-3xl p-8 flex flex-col items-center justify-center text-sm text-neutral-400">
              <RefreshCw size={24} className="animate-spin text-primary-main mb-2" />
              Cargando datos financieros...
            </div>
          )}

          {!loading && (
            <>
              {/* ── COMODÍN TAB 1: DASHBOARD FINANCIERO ── */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* TARJETAS ESTADÍSTICAS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: 'Recaudado hoy', value: formatCurrency(stats.totalDia), icon: <Clock size={16} />, color: 'bg-emerald-100 text-emerald-700' },
                        { title: 'Recaudación Semanal', value: formatCurrency(stats.totalSemana), icon: <TrendingUp size={16} />, color: 'bg-blue-100 text-blue-700' },
                        { title: 'Recaudación Mensual', value: formatCurrency(stats.totalMes), icon: <DollarSign size={16} />, color: 'bg-primary-main/15 text-primary-main' },
                        { title: 'Pagos Pendientes', value: formatCurrency(stats.totalPendiente), icon: <AlertTriangle size={16} />, color: 'bg-yellow-100 text-yellow-700' }
                      ].map((card, i) => (
                        <div key={i} className="bg-white border border-neutral-200 rounded-2xl px-5 py-4 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">{card.title}</p>
                            <p className="text-xl font-bold text-neutral-dark mt-1 leading-none">{card.value}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                            {card.icon}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ALERTA DE ALUMNOS CON ADEUDO */}
                    {stats.alumnosAdeudo > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-soft">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={18} />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-amber-800 leading-tight">Alerta de Adeudos Activos</h3>
                            <p className="text-xs text-amber-600/80 mt-0.5">Se han detectado {stats.alumnosAdeudo} alumno(s) con folios pendientes o pagos parciales de colegiaturas o exámenes.</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setActiveTab('pagos'); setFilterEstado('pendiente'); }}
                          className="text-xs font-bold text-amber-800 hover:text-amber-950 underline whitespace-nowrap bg-amber-100/50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200/50 transition-all"
                        >
                          Ver Adeudos
                        </button>
                      </div>
                    )}

                    {/* GRÁFICAS RECHARTS Y PANEL LATERAL */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Gráfica de Ingresos */}
                      <div className="bg-white border border-neutral-200 rounded-3xl p-6 lg:col-span-2 space-y-4">
                        <div>
                          <h2 className="text-base font-bold text-neutral-dark">Flujo de Ingresos Recientes</h2>
                          <p className="text-xs text-neutral-400 mt-0.5">Comparativa de ingresos recaudados contra montos pendientes de cobro.</p>
                        </div>
                        <div className="h-72 w-full text-xs">
                          {graficaData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-neutral-300 font-mono text-center">
                              No hay suficientes datos registrados<br />para generar la gráfica.
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={graficaData}>
                                <defs>
                                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1A9E96" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#1A9E96" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorPendientes" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E8A800" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#E8A800" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                                <XAxis dataKey="mes" stroke="#888888" />
                                <YAxis tickFormatter={(v) => `$${v}`} stroke="#888888" />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Area type="monotone" name="Ingresos Netos" dataKey="ingresos" stroke="#1A9E96" strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" />
                                <Area type="monotone" name="Pendiente de Cobro" dataKey="pendientes" stroke="#E8A800" strokeWidth={2} fillOpacity={1} fill="url(#colorPendientes)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>

                      {/* Adeudos Pendientes Críticos */}
                      <div className="bg-white border border-neutral-200 rounded-3xl p-6 flex flex-col space-y-4">
                        <div>
                          <h2 className="text-base font-bold text-neutral-dark font-semibold">Adeudos Críticos</h2>
                          <p className="text-xs text-neutral-400 mt-0.5">Últimos folios reportados con deudas activas.</p>
                        </div>
                        <div className="flex-1 space-y-3">
                          {adeudosCriticos.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-center p-8 text-xs text-neutral-400">
                              <CheckCircle className="text-emerald-500 mx-auto mb-2" size={24} />
                              ¡Excelente! No hay adeudos críticos registrados.
                            </div>
                          ) : (
                            adeudosCriticos.map((item) => (
                              <div key={item.id} className="border border-neutral-100 rounded-xl p-3 flex justify-between items-start hover:bg-neutral-50 transition-colors group">
                                <div className="min-w-0">
                                  <p className="font-bold text-xs text-neutral-dark truncate">{item.alumno_nombre}</p>
                                  <p className="text-[10px] text-neutral-400 mt-0.5">
                                    {CONCEPT_LABELS[item.tipo] || item.tipo} • {formatDate(item.fecha_pago)}
                                  </p>
                                  <span className="inline-block mt-1 font-mono text-[9px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                                    {item.folio}
                                  </span>
                                </div>
                                <div className="text-right flex-shrink-0 pl-2">
                                  <p className="font-bold text-xs text-red-600">{formatCurrency(item.monto)}</p>
                                  <span className="inline-block text-[9px] uppercase font-bold mt-1 px-1.5 py-0.5 rounded-full border bg-yellow-50 text-yellow-600 border-yellow-100">
                                    {item.estado}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>

                    {/* ÚLTIMOS PAGOS REGISTRADOS */}
                    <div className="bg-white border border-neutral-200 rounded-3xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-base font-bold text-neutral-dark">Últimos Movimientos Registrados</h2>
                          <p className="text-xs text-neutral-400 mt-0.5">Los últimos 5 cobros formalizados en ventanilla.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('pagos')}
                          className="text-xs font-bold text-primary-main hover:text-primary-dark flex items-center gap-1 group"
                        >
                          Ver historial completo
                          <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-neutral-100">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-neutral-50/80 text-left border-b border-neutral-100">
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Folio</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Alumno</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Concepto</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Monto</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Fecha</th>
                              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Estado</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {stats.ultimosPagos.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-xs text-neutral-400">
                                  No hay pagos registrados aún en el sistema.
                                </td>
                              </tr>
                            ) : (
                              stats.ultimosPagos.map((item) => (
                                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                  <td className="px-5 py-3.5 font-bold font-mono text-xs text-neutral-dark">{item.folio}</td>
                                  <td className="px-5 py-3.5">
                                    <p className="font-semibold text-xs text-neutral-dark">{item.alumno_nombre}</p>
                                    <p className="text-[9px] text-neutral-400 font-mono mt-0.5">{item.matricula || '—'}</p>
                                  </td>
                                  <td className="px-5 py-3.5 text-xs text-neutral-600 font-medium">
                                    {CONCEPT_LABELS[item.tipo] || item.tipo}
                                  </td>
                                  <td className="px-5 py-3.5 text-xs font-bold text-neutral-800">{formatCurrency(item.monto)}</td>
                                  <td className="px-5 py-3.5 text-xs text-neutral-400">{formatDate(item.fecha_pago)}</td>
                                  <td className="px-5 py-3.5">
                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${ROL_STYLES[item.estado]}`}>
                                      {item.estado}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* ── COMODÍN TAB 2: CONTROL DE PAGOS (TABLA DE GESTIÓN Y FILTROS) ── */}
                {activeTab === 'pagos' && (
                  <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden space-y-4">
                    
                    {/* Barra de Filtros */}
                    <div className="px-6 pt-6 pb-4 border-b border-neutral-100 flex flex-col gap-4">
                      
                      {/* Fila de Buscador */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar pago por alumno, matrícula o número de folio..."
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 pl-9 pr-3.5 py-3 text-xs outline-none focus:border-primary-main/50 focus:ring-2 focus:ring-primary-main/10 transition-all placeholder:text-neutral-300"
                          />
                        </div>
                      </div>

                      {/* Fila de Filtros Selectores */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        
                        {/* Selector de Concepto */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                            <Filter size={9} /> Concepto
                          </label>
                          <select
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/50 focus:ring-2 focus:ring-primary-main/10 transition-all"
                          >
                            <option value="">Todos los conceptos</option>
                            {CONCEPT_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Selector de Estado */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle size={9} /> Estado
                          </label>
                          <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/50 focus:ring-2 focus:ring-primary-main/10 transition-all"
                          >
                            <option value="">Todos los estados</option>
                            {ESTADO_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Fecha Inicio */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                            <Calendar size={9} /> Fecha Inicio
                          </label>
                          <input
                            type="date"
                            value={filterFechaInicio}
                            onChange={(e) => setFilterFechaInicio(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/50 focus:ring-2 focus:ring-primary-main/10 transition-all"
                          />
                        </div>

                        {/* Fecha Fin */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                            <Calendar size={9} /> Fecha Fin
                          </label>
                          <input
                            type="date"
                            value={filterFechaFin}
                            onChange={(e) => setFilterFechaFin(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/50 focus:ring-2 focus:ring-primary-main/10 transition-all"
                          />
                        </div>

                      </div>

                      {/* Botón para Limpiar Filtros */}
                      {(search || filterTipo || filterEstado || filterFechaInicio || filterFechaFin) && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSearch('');
                              setFilterTipo('');
                              setFilterEstado('');
                              setFilterFechaInicio('');
                              setFilterFechaFin('');
                            }}
                            className="text-xs font-semibold text-neutral-400 hover:text-primary-main transition-colors"
                          >
                            Limpiar todos los filtros
                          </button>
                        </div>
                      )}

                    </div>

                    {/* Tabla de Pagos */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-100 text-left">
                            <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Folio</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Alumno</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Concepto</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Monto</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Método</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Fecha</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Estado</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {pagos.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="px-6 py-16 text-center text-neutral-400 text-xs">
                                No se encontraron registros de pagos con los filtros seleccionados.
                              </td>
                            </tr>
                          ) : (
                            pagos.map((item) => (
                              <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors group">
                                <td className="px-6 py-3.5 font-mono font-bold text-xs text-neutral-dark">{item.folio}</td>
                                <td className="px-6 py-3.5">
                                  <div className="min-w-0">
                                    <p className="font-semibold text-xs text-neutral-dark truncate">{item.alumno_nombre}</p>
                                    <p className="text-[9px] font-mono text-neutral-400 mt-0.5">{item.matricula || 'MANUAL'}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-3.5">
                                  <span className="text-xs text-neutral-700 font-medium">
                                    {CONCEPT_LABELS[item.tipo] || item.tipo}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5 text-xs font-bold text-neutral-800">{formatCurrency(item.monto)}</td>
                                <td className="px-6 py-3.5 text-xs text-neutral-500 capitalize">{item.metodo_pago}</td>
                                <td className="px-6 py-3.5 text-xs text-neutral-400">{formatDate(item.fecha_pago)}</td>
                                <td className="px-6 py-3.5">
                                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${ROL_STYLES[item.estado]}`}>
                                    {item.estado}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5">
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenDetails(item)}
                                      className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:border-primary-main hover:text-primary-main hover:bg-primary-main/5 transition-all"
                                      title="Ver Detalle"
                                    >
                                      <Info size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPrint(item)}
                                      className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:border-accent-gold hover:text-accent-gold hover:bg-accent-gold/5 transition-all"
                                      title="Imprimir Recibo"
                                    >
                                      <Printer size={12} />
                                    </button>
                                    {item.estado !== 'cancelado' && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => openEditModal(item)}
                                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:border-primary-main hover:text-primary-main hover:bg-primary-main/5 transition-all"
                                          title="Editar Pago"
                                        >
                                          <Edit2 size={12} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleCancelPago(item)}
                                          className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                                          title="Cancelar Pago"
                                        >
                                          <XCircle size={12} />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer de la tabla */}
                    {pagos.length > 0 && (
                      <div className="px-6 py-3.5 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-between text-xs text-neutral-400">
                        <p>{pagos.length} cobro(s) listado(s)</p>
                        <p className="font-semibold text-neutral-600">
                          Recaudación parcial: {formatCurrency(pagos.filter(p => p.estado !== 'cancelado').reduce((acc, c) => acc + Number(c.monto), 0))}
                        </p>
                      </div>
                    )}

                  </div>
                )}
              </>
            )}

          </main>

      </div>

      {/* ── MODAL: REGISTRAR / EDITAR PAGO ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-medium" role="dialog">
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-neutral-100">
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-primary-main">Módulo Contable</p>
                <h2 className="text-base font-bold text-neutral-dark mt-0.5">
                  {editingPago ? `Modificar Pago (${editingPago.folio})` : 'Registrar Nuevo Cobro'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSavePago} className="px-7 py-6 space-y-4">
              
              {/* Selector de Entrada Manual o Catálogo */}
              {!editingPago && (
                <div className="flex items-center gap-6 bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs">
                  <span className="font-semibold text-neutral-600">Origen del Alumno:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-neutral-700">
                    <input
                      type="radio"
                      checked={!formPayload.isManual}
                      onChange={() => setFormPayload(prev => ({ ...prev, isManual: false, usuario_id: '', alumno_nombre: '', matricula: '' }))}
                      className="text-primary-main focus:ring-primary-main/20"
                    />
                    Buscar en Catálogo
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-neutral-700">
                    <input
                      type="radio"
                      checked={formPayload.isManual}
                      onChange={() => setFormPayload(prev => ({ ...prev, isManual: true, usuario_id: '', alumno_nombre: '', matricula: '' }))}
                      className="text-primary-main focus:ring-primary-main/20"
                    />
                    Captura Manual (Prospectos)
                  </label>
                </div>
              )}

              {/* Búsqueda de Alumno Registrado */}
              {!formPayload.isManual ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-select-alumno">
                    Alumno Escolarizado <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="modal-select-alumno"
                    required={!formPayload.isManual}
                    value={formPayload.usuario_id}
                    onChange={handleStudentSelect}
                    disabled={Boolean(editingPago)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all disabled:opacity-60"
                  >
                    <option value="">-- Seleccionar Alumno --</option>
                    {estudiantes.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.nombre} {st.apellido} ({st.matricula || 'Sin Matrícula'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Entrada Manual */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-nombre-alumno">
                      Nombre del Alumno <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="modal-nombre-alumno"
                      type="text"
                      required={formPayload.isManual}
                      value={formPayload.alumno_nombre}
                      onChange={(e) => setFormPayload(prev => ({ ...prev, alumno_nombre: e.target.value }))}
                      placeholder="Ej. Juan Pérez"
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-matricula-alumno">
                      Matrícula Escolar
                    </label>
                    <input
                      id="modal-matricula-alumno"
                      type="text"
                      value={formPayload.matricula}
                      onChange={(e) => setFormPayload(prev => ({ ...prev, matricula: e.target.value }))}
                      placeholder="Ej. 102456"
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Fila: Concepto y Monto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-select-concepto">
                    Concepto de Pago <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="modal-select-concepto"
                    required
                    value={formPayload.tipo}
                    onChange={(e) => setFormPayload(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
                  >
                    {CONCEPT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-monto-pago">
                    Monto (MXN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-monto-pago"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formPayload.monto}
                    onChange={(e) => setFormPayload(prev => ({ ...prev, monto: e.target.value }))}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
                  />
                </div>

              </div>

              {/* Fila: Método de Pago, Estado y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-metodo">
                    Método de Pago <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="modal-metodo"
                    required
                    value={formPayload.metodo_pago}
                    onChange={(e) => setFormPayload(prev => ({ ...prev, metodo_pago: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
                  >
                    {METODO_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-estado">
                    Estatus del Pago <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="modal-estado"
                    required
                    value={formPayload.estado}
                    onChange={(e) => setFormPayload(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
                  >
                    {ESTADO_OPTIONS.filter(opt => opt.value !== 'cancelado').map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-fecha">
                    Fecha de Registro <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-fecha"
                    type="date"
                    required
                    value={formPayload.fecha_pago}
                    onChange={(e) => setFormPayload(prev => ({ ...prev, fecha_pago: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
                  />
                </div>

              </div>

              {/* Observaciones */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-observaciones">
                  Observaciones o Notas del Recibo
                </label>
                <textarea
                  id="modal-observaciones"
                  rows="2"
                  value={formPayload.observaciones}
                  onChange={(e) => setFormPayload(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Detalles adicionales, número de transferencia, etc."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all resize-none"
                />
              </div>

              {/* Botones de acción del Modal */}
              <div className="flex gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary-main hover:bg-primary-dark text-white font-bold text-xs py-3 active:scale-[0.98] transition-all"
                >
                  {editingPago ? 'Guardar Cambios' : 'Confirmar Registro'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-semibold text-xs px-5 py-3 transition-colors"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DETALLES COMPLETOS DEL PAGO ── */}
      {detailsOpen && selectedPago && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setDetailsOpen(false); }}
        >
          <div className="bg-white rounded-3xl w-full max-w-md shadow-medium overflow-hidden" role="dialog">
            {/* Sello de estado decorativo */}
            <div className="bg-primary-main text-white px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider opacity-60">Operación contable exitosa</p>
                <h3 className="text-sm font-extrabold">{selectedPago.folio}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${ROL_STYLES[selectedPago.estado]} border-white/20`}>
                {selectedPago.estado}
              </span>
            </div>

            <div className="p-6 space-y-4">
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={15} className="text-neutral-400" />
                  <div>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase">Alumno / Cliente</p>
                    <p className="text-xs font-semibold text-neutral-800">{selectedPago.alumno_nombre}</p>
                    {selectedPago.matricula && (
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Matrícula: {selectedPago.matricula}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={15} className="text-neutral-400" />
                  <div>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase">Concepto de Cobro</p>
                    <p className="text-xs font-semibold text-neutral-800">{CONCEPT_LABELS[selectedPago.tipo] || selectedPago.tipo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <DollarSign size={15} className="text-neutral-400" />
                    <div>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase">Monto Total</p>
                      <p className="text-xs font-bold text-neutral-800">{formatCurrency(selectedPago.monto)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard size={15} className="text-neutral-400" />
                    <div>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase">Método de pago</p>
                      <p className="text-xs font-semibold text-neutral-800 capitalize">{selectedPago.metodo_pago}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={15} className="text-neutral-400" />
                  <div>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase">Fecha de cobro</p>
                    <p className="text-xs font-semibold text-neutral-800">{formatDate(selectedPago.fecha_pago)}</p>
                  </div>
                </div>

                {selectedPago.observaciones && (
                  <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 mt-2">
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-1"><Info size={9} /> Observaciones</p>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{selectedPago.observaciones}</p>
                  </div>
                )}
              </div>

              {/* Botón de cierre y de impresión en ticket */}
              <div className="flex gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => { setDetailsOpen(false); handleOpenPrint(selectedPago); }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent-gold hover:bg-yellow-600 text-white font-bold text-xs py-2.5 active:scale-[0.98] transition-all"
                >
                  <Printer size={13} />
                  Imprimir Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsOpen(false)}
                  className="rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-semibold text-xs px-5 py-2.5 transition-colors"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PREVISUALIZAR RECIBO ANTES DE IMPRIMIR ── */}
      {printOpen && selectedPago && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setPrintOpen(false); }}
        >
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-medium flex flex-col my-8" role="dialog">
            {/* Cabecera */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-neutral-100 flex-shrink-0">
              <div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-accent-gold">Previsualizar Documento</p>
                <h2 className="text-base font-bold text-neutral-dark mt-0.5">Recibo del Folio: {selectedPago.folio}</h2>
              </div>
              <button
                type="button"
                onClick={() => setPrintOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Recibo Renderizado para Pantalla */}
            <div className="p-7 overflow-y-auto max-h-[60vh] bg-neutral-light border-b border-neutral-100">
              <div className="bg-white border border-neutral-300 rounded-2xl p-6 space-y-6 shadow-soft mx-auto max-w-lg text-neutral-800 font-mono text-[10px] leading-relaxed">
                
                {/* Cabecera del Comprobante */}
                <div className="flex justify-between items-start border-b pb-4 border-dashed border-neutral-300">
                  <div>
                    <h4 className="font-bold text-[11px] uppercase tracking-wider">Instituto Alfonso Reyes</h4>
                    <p className="text-[9px] text-neutral-400 mt-0.5">Cédula Oficial • Educación de Excelencia</p>
                    <p className="text-[9px] text-neutral-400">Tuxtla Gutiérrez, Chiapas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-accent-orange text-xs">{selectedPago.folio}</p>
                    <p className="text-[8px] text-neutral-400 mt-0.5">Fecha: {formatDate(selectedPago.fecha_pago)}</p>
                  </div>
                </div>

                {/* Cliente / Concepto */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest">REGISTRADO A:</span>
                    <p className="font-bold text-neutral-dark mt-0.5">{selectedPago.alumno_nombre}</p>
                    {selectedPago.matricula && (
                      <p className="text-[9px] text-neutral-500 font-mono mt-0.5">Matrícula: {selectedPago.matricula}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest">MÉTODO Y ESTADO:</span>
                    <p className="font-bold text-neutral-dark mt-0.5 capitalize">{selectedPago.metodo_pago}</p>
                    <p className="font-bold text-emerald-600 mt-0.5 uppercase">{selectedPago.estado}</p>
                  </div>
                </div>

                {/* Tabla de Cobros */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full text-[9px] border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="px-3 py-2 text-left font-bold text-neutral-500 uppercase">Concepto</th>
                        <th className="px-3 py-2 text-right font-bold text-neutral-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 text-left font-semibold">{CONCEPT_LABELS[selectedPago.tipo] || selectedPago.tipo}</td>
                        <td className="px-3 py-2 text-right font-bold">{formatCurrency(selectedPago.monto)}</td>
                      </tr>
                      <tr className="bg-neutral-50 border-t border-dashed border-neutral-300">
                        <td className="px-3 py-2 text-right font-bold text-neutral-400 uppercase">Total Pagado:</td>
                        <td className="px-3 py-2 text-right font-extrabold text-[11px] text-neutral-900">{formatCurrency(selectedPago.monto)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Notas */}
                {selectedPago.observaciones && (
                  <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                    <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest">Notas Adicionales</p>
                    <p className="text-[9px] text-neutral-600 mt-0.5">{selectedPago.observaciones}</p>
                  </div>
                )}

                {/* Footer Recibo */}
                <div className="text-center text-[8px] text-neutral-400 pt-4 border-t border-dashed border-neutral-200">
                  <p>Gracias por tu pago. Comprobante Escolar Oficial.</p>
                </div>

              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2.5 px-7 py-5 bg-white border-t border-neutral-100 flex-shrink-0">
              <button
                type="button"
                onClick={triggerPrint}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-main hover:bg-primary-dark text-white font-bold text-xs py-3 active:scale-[0.98] transition-all"
              >
                <Printer size={15} />
                Imprimir Documento
              </button>
              <button
                type="button"
                onClick={() => setPrintOpen(false)}
                className="rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-semibold text-xs px-5 py-3 transition-colors"
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
