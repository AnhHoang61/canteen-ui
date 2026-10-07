// Canteen POS — types as documentation. Global: window.CanteenPOS
type Tone = 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
type IconName = 'home'|'bag'|'bell'|'chat'|'calendar'|'doc'|'check'|'alert'|'clock'|'card'|'qr'|'face'|'wifi'|'wifiOff'|'user'|'minus'|'plus'|'cash'|'wallet'|'sync'|'ban'|'store'|'receipt'|'undo'|'search'|'tag'|'users'|'lock'|'x'|'chevron';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary'|'secondary'|'accent'|'ghost'|'danger'; size?: 'sm'|'md'|'lg'; block?: boolean; icon?: IconName; iconRight?: IconName; }
export interface StatusBadgeProps { tone?: Tone; icon?: IconName | null; children: React.ReactNode; }
export interface MoneyProps { value: number; size?: 'md'|'lg'|'xl'; tone?: 'brand'|'accent'|'danger'|'success'; strike?: boolean; sign?: boolean; }
export interface FieldProps { label?: string; hint?: string; error?: string; icon?: IconName; suffix?: string; numeric?: boolean; as?: 'input'|'select'|'textarea'; options?: string[]; rows?: number; type?: string; value?: string; defaultValue?: string; placeholder?: string; onChange?: (e: any) => void; }
export interface TopBarProps { canteen?: string; counter?: string; shift?: string; staff?: string; online?: boolean; pending?: number; right?: React.ReactNode; }
export interface OfflineBannerProps { pending?: number; qrPending?: number; walletLimit?: number; syncing?: boolean; done?: number; conflicts?: number; }
export interface CategoryTabsProps { items: { id: string; label: string; count?: number }[]; active?: string; onChange?: (id: string) => void; }
export interface MenuItemCardProps { code?: string; name: string; price: number; qty?: number; status?: 'available'|'low'|'soldout'|'blocked'; stockLeft?: number; blockedReason?: string; promo?: string; onAdd?: () => void; }
export interface OrderLine { name: string; price: number; qty: number; note?: string; }
export interface OrderCartProps { orderCode?: string; staff?: string; counter?: string; createdAt?: string; lines?: OrderLine[]; discount?: { label: string; amount: number }; badge?: React.ReactNode; children?: React.ReactNode; }
export interface BuyerCardProps { role?: 'student'|'teacher'|'university'|'guest'; name?: string; klass?: string; code?: string; method?: 'card'|'qr'|'bio'; real?: number; bonus?: number; limit?: { used: number; max: number }; blocked?: string[]; compact?: boolean; children?: React.ReactNode; }
export interface IdentifyPanelProps { active?: 'card'|'qr'|'bio'; state?: 'idle'|'reading'|'found'|'error'; message?: string; onGuest?: (() => void) | false; }
export interface CashPaymentProps { total: number; given?: number; shift?: string; staff?: string; keypad?: boolean; layout?: 'stack'|'wide'; onConfirm?: () => void; }
export interface QRPaymentProps { total: number; orderCode: string; state?: 'pending'|'success'|'check'|'offline'; memo?: string; account?: string; elapsed?: string; issue?: string; children?: React.ReactNode; }
export interface PreorderTicketProps { code: string; source?: 'app'|'class'; buyer: string; items?: { qty: number; name: string }[]; pickupAt: string; counter: string; eta?: string; status?: 'new'|'preparing'|'ready'|'done'|'cancelled'; actions?: boolean; }
export interface ShiftSummaryProps { opening?: number; orders?: number; wallet?: number; walletCount?: number; cash?: number; cashCount?: number; qr?: number; qrCount?: number; qrPending?: number; refunds?: number; refundCount?: number; cancelCount?: number; cashRefund?: number; counted?: number; children?: React.ReactNode; }
export interface NavBarProps { title: string; onBack?: (() => void) | false; right?: React.ReactNode; }
export interface SectionLabelProps { children: React.ReactNode; help?: boolean; onEdit?: () => void; }
export interface ListRowProps { title: React.ReactNode; value?: React.ReactNode; icon?: IconName; chevron?: boolean; onClick?: () => void; note?: React.ReactNode; noteTone?: 'warn'|'danger'|'info'; trailing?: React.ReactNode; children?: React.ReactNode; }
export interface InlineNoteProps { tone?: 'warn'|'danger'|'info'; children: React.ReactNode; }
// Controlled usage: OrderCartProps.onQty?(index, delta) makes lines controlled; CashPaymentProps.onConfirm receives the amount given;
// PreorderTicketProps.onNext?() advances status; ShiftSummaryProps.onCount?(amount | null) reports counted cash.
