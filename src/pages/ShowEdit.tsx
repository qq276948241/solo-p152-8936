import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Calendar, Ticket, FileText, CheckCircle2, AlertCircle, Clock, Info } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FormField, TextInput, TextArea, NumberInput, SelectInput, DateTimeInput } from '@/components/FormFields';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import type { ShowStatus } from '@/types';
import { SHOW_STATUS_LABELS } from '@/types';
import { formatDateTimeLocal, parseDateTimeLocal, formatDateTime } from '@/utils/format';
import { cn } from '@/lib/utils';

interface FormState {
  venue: string;
  date: string;
  price: number;
  status: ShowStatus;
  address: string;
  notes: string;
}

interface FormErrors {
  venue?: string;
  date?: string;
  price?: string;
  address?: string;
}

const STATUS_OPTIONS = (Object.keys(SHOW_STATUS_LABELS) as ShowStatus[]).map((k) => ({
  value: k,
  label: SHOW_STATUS_LABELS[k],
}));

export default function ShowEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getShowById, updateShow } = useAppStore();

  const show = useMemo(() => (id ? getShowById(id) : undefined), [id, getShowById]);

  const [form, setForm] = useState<FormState>({
    venue: '',
    date: formatDateTimeLocal(new Date().toISOString()),
    price: 0,
    status: 'upcoming',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      setForm({
        venue: show.venue,
        date: formatDateTimeLocal(show.date),
        price: show.price,
        status: show.status,
        address: show.address,
        notes: show.notes,
      });
    }
  }, [show]);

  const isDirty = useMemo(() => {
    if (!show) return false;
    return (
      form.venue !== show.venue ||
      parseDateTimeLocal(form.date) !== show.date ||
      form.price !== show.price ||
      form.status !== show.status ||
      form.address !== show.address ||
      form.notes !== show.notes
    );
  }, [form, show]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.venue.trim()) next.venue = '请输入场地名称';
    if (!form.date) next.date = '请选择演出时间';
    if (form.price < 0) next.price = '票价不能为负数';
    if (!form.address.trim()) next.address = '请输入详细地址';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!validate() || !show) return;

    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));

    updateShow(show.id, {
      venue: form.venue.trim(),
      date: parseDateTimeLocal(form.date),
      price: form.price,
      status: form.status,
      address: form.address.trim(),
      notes: form.notes.trim(),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!show) {
    return (
      <div className="page-container">
        <button
          type="button"
          onClick={() => navigate('/shows')}
          className="btn-secondary mb-6 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          返回演出列表
        </button>
        <EmptyState
          icon="shows"
          title="演出不存在"
          description="该演出可能已被删除或 ID 无效，请返回列表重新选择"
        />
      </div>
    );
  }

  return (
    <div className="page-container pb-32 animate-fade-in">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/shows')}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 min-h-[44px] -ml-2 px-2 rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回演出列表</span>
        </button>

        <div className="card-base p-5 sm:p-6 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white break-words">
                  {show.venue}
                </h1>
                <StatusBadge status={show.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent/70" />
                  {formatDateTime(show.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-accent/70" />
                  <span className="truncate max-w-[280px]">{show.address}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card-base p-5 sm:p-6 space-y-6 animate-fade-in animate-delay-100">
        <div className="flex items-center gap-2 pb-4 border-b border-white/10">
          <FileText className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-white">编辑演出信息</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="场地名称" error={errors.venue} htmlFor="venue" className="md:col-span-2">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <TextInput
                id="venue"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                placeholder="例如：MAO Livehouse 北京"
                className="pl-11"
                autoComplete="off"
              />
            </div>
          </FormField>

          <FormField label="演出时间" error={errors.date} htmlFor="date">
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <DateTimeInput
                id="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="pl-11"
              />
            </div>
          </FormField>

          <FormField label="演出状态" htmlFor="status">
            <SelectInput
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ShowStatus })}
              options={STATUS_OPTIONS}
            />
          </FormField>

          <FormField label="票价（元）" error={errors.price} htmlFor="price">
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <NumberInput
                id="price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="pl-11"
                min={0}
                step={10}
              />
            </div>
          </FormField>

          <FormField label="详细地址" error={errors.address} htmlFor="address" className="md:col-span-2">
            <TextInput
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="请输入详细地址，便于粉丝查找"
              autoComplete="off"
            />
          </FormField>

          <FormField label="备注信息" htmlFor="notes" className="md:col-span-2">
            <TextArea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="补充说明：暖场乐队、入场须知、周边售卖等..."
              rows={5}
            />
            <div className="flex items-start gap-1.5 mt-2 text-xs text-white/40">
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>备注信息会在演出详情页展示给观众，请填写与本场演出相关的重要信息</span>
            </div>
          </FormField>
        </div>
      </form>

      <div className="fixed left-0 right-0 bottom-0 z-40 bg-primary-500/95 backdrop-blur-lg border-t border-white/10">
        <div className="container mx-auto max-w-6xl px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {saved ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium animate-fade-in">
                <CheckCircle2 className="w-5 h-5" />
                <span className="hidden sm:inline">保存成功！已同步更新</span>
                <span className="sm:hidden">已保存</span>
              </div>
            ) : isDirty ? (
              <div className="flex items-center gap-2 text-accent text-sm font-medium">
                <AlertCircle className="w-5 h-5 animate-pulse-soft" />
                <span className="hidden sm:inline">有未保存的修改</span>
                <span className="sm:hidden">未保存</span>
              </div>
            ) : (
              <div className="text-white/50 text-sm">
                <span className="hidden sm:inline">数据为最新状态</span>
                <span className="sm:hidden inline">已同步</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate('/shows')}
              className="btn-secondary px-4 sm:px-5 py-2.5 text-sm sm:text-base"
            >
              <span className="sm:inline hidden">取消</span>
              <span className="sm:hidden inline">返回</span>
            </button>
            <button
              type="submit"
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={cn(
                'btn-primary inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 text-sm sm:text-base',
                saved && 'bg-emerald-500 hover:bg-emerald-500',
              )}
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              {saving ? '保存中...' : saved ? '已保存' : '保存修改'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
