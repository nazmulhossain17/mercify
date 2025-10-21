import PendingSavings from "@/components/admin/pending-savings/PendingSavings"
import ScheduleTable from "@/components/admin/pending-schedule/PendingSchedule"
import PaymentList from "@/components/admin/PendingPayment/PendingPayemnt"


export const PendingPayments = () => {
  return (
     <>
        <div className="mt-10">
        <ScheduleTable/>
         </div>

         <div>
            <PaymentList />
         </div>

         <div className="mt-10">
          <PendingSavings/>
         </div>
     </>
  )
}
