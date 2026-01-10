import { Button } from "./ui/button";

interface AuthFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    submitType: string;
}

export default function AuthForm({ handleSubmit, submitType }: AuthFormProps) {
    return (
        <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-3">
                {
                    submitType === 'Sign Up' && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-300">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    )
                }
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                {
                    submitType === 'Sign Up' && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )
                }
            </div>

            <Button
                type="submit"
                aria-label={submitType}
                className="w-full py-5 mt-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                {submitType}
            </Button>
        </form>
    );
}
