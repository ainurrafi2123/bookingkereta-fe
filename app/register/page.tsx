
import AuthIllustration from "@/components/layout/auth-illustration";
import RegisterForm from "@/components/form/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen h-screen bg-linear-to-br from-blue-300 to-blue-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-white/5 rounded-full"></div>
                
      <div 
        className="rounded-2xl overflow-hidden shadow-2xl bg-white relative z-10"
        style={{ 
          width: '750px',
          maxWidth: '95vw',
          height: '500px'
        }}
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Kiri: Ilustrasi */}
          <AuthIllustration />

          {/* Kanan: Form */}
          <div className="w-full lg:w-1/2 p-2 lg:p-4  ">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}