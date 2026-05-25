import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  CheckCircle, 
  Circle, 
  MapPin, 
  ShieldAlert, 
  TrendingUp, 
  Edit2, 
  Trash2, 
  X, 
  Activity, 
  Clock, 
  Award,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { StaffMember } from '../types';

// Storage Key
const KEY_STAFF = 'favour_staff_v1';

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Dr. Adebayo Ogunwale',
    role: 'Admin',
    phone: '08067234518',
    status: 'Active',
    lastSeen: 'Currently Online',
    initials: 'AO'
  },
  {
    id: 'staff-2',
    name: 'Samuel Okon',
    role: 'Attendant',
    phone: '08123456789',
    status: 'Active',
    lastSeen: '2 mins ago',
    initials: 'SO'
  },
  {
    id: 'staff-3',
    name: 'Maryam Bello',
    role: 'Attendant',
    phone: '08098765432',
    status: 'Active',
    lastSeen: '1 hour ago',
    initials: 'MB'
  },
  {
    id: 'staff-4',
    name: 'Chidi Eze',
    role: 'Attendant',
    phone: '07055544433',
    status: 'Away',
    lastSeen: 'On Leave',
    initials: 'CE'
  }
];

// Mock Performance Data for display
interface PerformanceData {
  salesTarget: number;
  salesCompleted: number;
  attendanceDays: number;
  clockInTime: string;
  rating: number;
  recentSalesValue: string;
}

const PERFORMANCE_DATABASE: Record<string, PerformanceData> = {
  'staff-1': { salesTarget: 60, salesCompleted: 52, attendanceDays: 20, clockInTime: '07:45 AM', rating: 4.9, recentSalesValue: '₦450,200' },
  'staff-2': { salesTarget: 50, salesCompleted: 42, attendanceDays: 19, clockInTime: '07:58 AM', rating: 4.7, recentSalesValue: '₦210,500' },
  'staff-3': { salesTarget: 50, salesCompleted: 48, attendanceDays: 20, clockInTime: '07:50 AM', rating: 4.8, recentSalesValue: '₦320,100' },
  'staff-4': { salesTarget: 40, salesCompleted: 15, attendanceDays: 8, clockInTime: 'On Leave', rating: 4.5, recentSalesValue: '₦85,000' }
};

export default function StaffView() {
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(KEY_STAFF);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse staff data', e);
      }
    }
    return DEFAULT_STAFF;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'Admin' | 'Attendant'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Away'>('all');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPerfOpen, setIsPerfOpen] = useState(false);
  
  // Active editing or viewing staff member
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  // Forms state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState<'Admin' | 'Attendant'>('Attendant');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Away'>('Active');

  useEffect(() => {
    localStorage.setItem(KEY_STAFF, JSON.stringify(staff));
  }, [staff]);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    // Direct Initials calculation
    const parts = formName.trim().split(' ');
    let init = 'ST';
    if (parts.length > 1) {
      init = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts[0]) {
      init = parts[0].substring(0, 2).toUpperCase();
    }

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: formName.trim(),
      role: formRole,
      phone: formPhone.trim(),
      status: formStatus,
      lastSeen: formStatus === 'Active' ? 'Just Now' : 'Away',
      initials: init
    };

    setStaff((prev) => [...prev, newMember]);
    resetForm();
    setIsAddOpen(false);
  };

  const handleEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !formName.trim() || !formPhone.trim()) return;

    const parts = formName.trim().split(' ');
    let init = 'ST';
    if (parts.length > 1) {
      init = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts[0]) {
      init = parts[0].substring(0, 2).toUpperCase();
    }

    const updated = staff.map((member) => {
      if (member.id === selectedStaff.id) {
        return {
          ...member,
          name: formName.trim(),
          role: formRole,
          phone: formPhone.trim(),
          status: formStatus,
          lastSeen: formStatus === 'Active' ? 'Just Now' : 'On Leave',
          initials: init
        };
      }
      return member;
    });

    setStaff(updated);
    resetForm();
    setIsEditOpen(false);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from pharmacy staff records?`)) {
      setStaff((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const openEditModal = (member: StaffMember) => {
    setSelectedStaff(member);
    setFormName(member.name);
    setFormRole(member.role as 'Admin' | 'Attendant');
    setFormPhone(member.phone);
    setFormStatus(member.status);
    setIsEditOpen(true);
  };

  const openPerformanceModal = (member: StaffMember) => {
    setSelectedStaff(member);
    setIsPerfOpen(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormRole('Attendant');
    setFormPhone('');
    setFormStatus('Active');
    setSelectedStaff(null);
  };

  // Computations
  const totalStaff = staff.length;
  const adminCount = staff.filter((m) => m.role === 'Admin').length;
  const attendantCount = staff.filter((m) => m.role === 'Attendant').length;
  const activeCount = staff.filter((m) => m.status === 'Active').length;
  const attendanceRate = totalStaff > 0 ? Math.round((activeCount / totalStaff) * 100) : 0;

  // Filter lists
  const filteredStaff = staff.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.phone.includes(searchQuery);
    
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get performance item (safeguarded)
  const getPerfDetails = (id: string): PerformanceData => {
    return PERFORMANCE_DATABASE[id] || {
      salesTarget: 50,
      salesCompleted: 35,
      attendanceDays: 18,
      clockInTime: '08:02 AM',
      rating: 4.6,
      recentSalesValue: '₦125,000'
    };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-on-surface flex items-center gap-2">
            <span className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
              <Users className="w-6 h-6" />
            </span>
            Staff Management
          </h2>
          <p className="text-sm text-secondary mt-1">Oversee pharmacy operations, roles, and attendance performance.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="bg-primary text-white hover:brightness-95 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Bento Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Staff */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-border flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs uppercase font-black tracking-widest text-on-secondary-container">Total Staff</span>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-black text-primary">{totalStaff} Registered</div>
            <div className="mt-2 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${totalStaff ? 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-secondary mt-2">Active records in Ibadan Branch</p>
          </div>
        </div>

        {/* Roles Breakout */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-border flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs uppercase font-black tracking-widest text-on-secondary-container">Roles Breakdown</span>
            <Award className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <div className="text-2xl font-black text-on-surface">
              {adminCount} Admin, {attendantCount} {attendantCount === 1 ? 'Attendant' : 'Attendants'}
            </div>
            <p className="text-xs text-secondary mt-2 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-primary" />
              All permission lists verified
            </p>
          </div>
        </div>

        {/* Attendance Rates */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-border flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs uppercase font-black tracking-widest text-on-secondary-container">Today's attendance</span>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-2xl font-black text-success">{activeCount} Clocked In</div>
            <div className="text-xs text-secondary mt-2">
              <span className="font-bold text-success">{attendanceRate}%</span> attendance rate today
            </div>
          </div>
        </div>

      </div>

      {/* Staff List & Control Area */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-border overflow-hidden">
        
        {/* Header with Search and Filter bar */}
        <div className="p-6 border-b border-border flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-surface-container-low/30">
          <h3 className="font-black text-lg text-on-surface">Active Personnel</h3>
          
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Quick search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-secondary absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                placeholder="Search staff members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border dark:border-zinc-700 bg-surface rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="border border-border dark:border-zinc-700 bg-surface rounded-xl px-3 py-2 text-xs font-bold text-secondary cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admins Only</option>
              <option value="Attendant">Attendants Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-border dark:border-zinc-700 bg-surface rounded-xl px-3 py-2 text-xs font-bold text-secondary cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Clocked In (Active)</option>
              <option value="Away">Away / Leave</option>
            </select>
          </div>
        </div>

        {/* Desktop and Mobile personnel list */}
        {filteredStaff.length === 0 ? (
          <div className="p-12 text-center text-secondary flex flex-col items-center justify-center">
            <Users className="w-12 h-12 mb-3 text-muted/60" />
            <p className="font-bold text-on-surface">No staff members found</p>
            <p className="text-xs mt-1">Try relaxing filters or search query parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 text-on-secondary-container border-b border-border">
                  <th className="px-6 py-4 font-black text-xs uppercase tracking-wider">Name &amp; Role</th>
                  <th className="px-6 py-4 font-black text-xs uppercase tracking-wider">Contact Information</th>
                  <th className="px-6 py-4 font-black text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-black text-xs uppercase tracking-wider">Last Sync Activity</th>
                  <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-surface-container-low/20 transition-colors group">
                    
                    {/* Name & Role */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          member.role === 'Admin' 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'bg-tertiary-fixed-dim text-on-tertiary-fixed'
                        }`}>
                          {member.initials}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface group-hover:text-primary transition-colors">{member.name}</div>
                          <span className={`inline-block px-2.5 py-0.5 mt-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${
                            member.role === 'Admin' 
                              ? 'bg-primary-container text-on-primary-container' 
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4.5 text-sm font-medium text-secondary">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black select-none ${
                        member.status === 'Active' 
                          ? 'bg-success/15 text-success' 
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          member.status === 'Active' ? 'bg-success animate-pulse' : 'bg-secondary'
                        }`}></span>
                        {member.status === 'Active' ? 'Active' : 'Away'}
                      </span>
                    </td>

                    {/* Last seen */}
                    <td className="px-6 py-4.5 text-sm text-secondary font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-muted shrink-0" />
                        <span>{member.lastSeen}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Monitor performance */}
                        <button 
                          onClick={() => openPerformanceModal(member)}
                          className="p-2 text-primary hover:bg-primary/15 rounded-xl transition-colors cursor-pointer"
                          title="View Records &amp; Target Monitoring"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        {/* Edit profile */}
                        <button 
                          onClick={() => openEditModal(member)}
                          className="p-2 text-tertiary hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* Delete staff */}
                        {member.id !== 'staff-1' && (
                          <button 
                            onClick={() => handleDeleteStaff(member.id, member.name)}
                            className="p-2 text-danger hover:bg-error-container/25 rounded-xl transition-colors cursor-pointer"
                            title="Remove Personnel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD STAFF MEMBER */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface-container-lowest border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-black text-lg text-on-surface flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Add Staff Member
              </h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-secondary hover:text-on-surface bg-surface-container rounded-full p-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs text-secondary font-black uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Samuel Okon"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-secondary font-black uppercase tracking-wider">Pharmacy Role</label>
                <select 
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                >
                  <option value="Attendant">Attendant</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-secondary font-black uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 08123456789"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-secondary font-black uppercase tracking-wider">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      checked={formStatus === 'Active'}
                      onChange={() => setFormStatus('Active')}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Active (Clocked In)</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      checked={formStatus === 'Away'}
                      onChange={() => setFormStatus('Away')}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Away / On Leave</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-secondary text-sm font-bold cursor-pointer hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer hover:brightness-95"
                >
                  Save Member
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STAFF MEMBER */}
      {isEditOpen && selectedStaff && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface-container-lowest border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-black text-lg text-on-surface flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                Edit Profile
              </h3>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="text-secondary hover:text-on-surface bg-surface-container rounded-full p-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditStaff} className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs text-secondary font-black uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-secondary font-black uppercase tracking-wider">Pharmacy Role</label>
                <select 
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                >
                  <option value="Attendant">Attendant</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-secondary font-black uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-secondary font-black uppercase tracking-wider">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      checked={formStatus === 'Active'}
                      onChange={() => setFormStatus('Active')}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Active (Clocked In)</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      checked={formStatus === 'Away'}
                      onChange={() => setFormStatus('Away')}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Away / On Leave</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-secondary text-sm font-bold cursor-pointer hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer hover:brightness-95"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW PERFORMANCE & COMPLIANCE */}
      {isPerfOpen && selectedStaff && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface-container-lowest border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-slide-up">
            
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-black text-lg text-on-surface flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary animate-pulse" />
                Performance Monitor: {selectedStaff.name}
              </h3>
              <button 
                onClick={() => setIsPerfOpen(false)}
                className="text-secondary hover:text-on-surface bg-surface-container rounded-full p-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-border/80">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/25">
                  {selectedStaff.initials}
                </div>
                <div>
                  <h4 className="font-black text-base text-on-surface">{selectedStaff.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-secondary font-medium">{selectedStaff.role}</span>
                    <span className="text-secondary/50">•</span>
                    <span className="text-xs text-secondary font-medium">{selectedStaff.phone}</span>
                  </div>
                </div>
              </div>

              {/* Grid of indicators */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Sale Performance Meter */}
                <div className="border border-border p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary font-black uppercase tracking-wider">Completed Sales</span>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-xl font-black text-primary">
                    {getPerfDetails(selectedStaff.id).salesCompleted} / {getPerfDetails(selectedStaff.id).salesTarget}
                  </div>
                  <p className="text-[11px] text-secondary font-medium">Monthly target transaction volume</p>
                </div>

                {/* attendance days */}
                <div className="border border-border p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary font-black uppercase tracking-wider">Attendance (Monthly)</span>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div className="text-xl font-black text-success">
                    {getPerfDetails(selectedStaff.id).attendanceDays} Days
                  </div>
                  <p className="text-[11px] text-secondary font-medium">Active verification clock-ins</p>
                </div>

                {/* Clock in compliance */}
                <div className="border border-border p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary font-black uppercase tracking-wider">Average Clock-In</span>
                    <Clock className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="text-lg font-black text-on-surface">
                    {getPerfDetails(selectedStaff.id).clockInTime}
                  </div>
                  <p className="text-[11px] text-secondary font-medium">Standard start time limit: 08:00 AM</p>
                </div>

                {/* Rating */}
                <div className="border border-border p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary font-black uppercase tracking-wider">Satisfaction Index</span>
                    <Award className="w-4 h-4 text-warning" />
                  </div>
                  <div className="text-lg font-black text-on-surface">
                    {getPerfDetails(selectedStaff.id).rating} / 5.0
                  </div>
                  <p className="text-[11px] text-secondary font-medium">Based on customer feedback surveys</p>
                </div>

              </div>

              {/* Progress target graph visual */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-secondary font-black uppercase tracking-wider">Active Sale Target Level</span>
                  <span className="font-bold text-primary">
                    {Math.round((getPerfDetails(selectedStaff.id).salesCompleted / getPerfDetails(selectedStaff.id).salesTarget) * 100)}% Reached
                  </span>
                </div>
                <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden border border-border/30">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (getPerfDetails(selectedStaff.id).salesCompleted / getPerfDetails(selectedStaff.id).salesTarget) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Total volume contribution */}
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs text-secondary font-bold uppercase tracking-wider">Total Sales Invoiced</p>
                  <p className="text-sm font-medium text-secondary">Verified prescription disbursements</p>
                </div>
                <div className="text-lg font-black text-primary">
                  {getPerfDetails(selectedStaff.id).recentSalesValue}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setIsPerfOpen(false)}
                  className="px-6 py-2.5 bg-secondary text-white hover:brightness-95 rounded-xl text-sm font-bold cursor-pointer transition-all"
                >
                  Close Monitor
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
