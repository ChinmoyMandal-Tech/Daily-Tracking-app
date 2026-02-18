import React, { useState, useEffect, useRef } from 'react';
import {
    CheckCircle2,
    Circle,
    Plus,
    Trash2,
    History,
    LayoutDashboard,
    Settings,
    Download,
    Upload
} from 'lucide-react';

// --- SUB-COMPONENTS (Defined OUTSIDE the main component) ---

const HabitItem = ({ habit, date, isHistoryMode = false, isCompleted, toggleHabit, deleteHabit }) => {
    return (
        <div className={`flex items-center justify-between p-3 mb-2 rounded-lg border transition-all ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
            <div
                onClick={() => !isHistoryMode && toggleHabit(date, habit.id)}
                className={`flex items-center gap-3 ${!isHistoryMode ? 'cursor-pointer' : ''} flex-1`}
            >
                {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                    <Circle className="w-6 h-6 text-slate-300" />
                )}
                <span className={`font-medium ${isCompleted ? 'text-slate-700' : 'text-slate-900'}`}>
                    {habit.name}
                </span>
            </div>

            {!isHistoryMode && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteHabit(habit.id);
                    }}
                    className="text-slate-400 hover:text-red-500 p-2"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

const DashboardView = ({
    todayStr,
    activeHabits,
    logs,
    newHabitName,
    setNewHabitName,
    addHabit,
    toggleHabit,
    deleteHabit,
    updateNote
}) => {
    const todayLog = logs[todayStr] || { completed_habit_ids: [], note: '' };
    const completedCount = todayLog.completed_habit_ids.length;
    const totalActive = activeHabits.length;
    const progressPercentage = totalActive === 0 ? 0 : Math.round((completedCount / totalActive) * 100);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Today</h2>
                        <p className="text-slate-500 text-sm">
                            {new Date(todayStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-indigo-600">{progressPercentage}%</span>
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-1">
                {activeHabits.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        No active habits. Add one below!
                    </div>
                ) : (
                    activeHabits.map(habit => {
                        const isCompleted = todayLog.completed_habit_ids.includes(habit.id);
                        return (
                            <HabitItem
                                key={habit.id}
                                habit={habit}
                                date={todayStr}
                                isCompleted={isCompleted}
                                toggleHabit={toggleHabit}
                                deleteHabit={deleteHabit}
                            />
                        );
                    })
                )}
            </div>

            <form onSubmit={addHabit} className="flex gap-2">
                <input
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="Add new habit..."
                    className="flex-1 p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus={false}
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </form>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Daily Remarks</h3>
                <textarea
                    value={todayLog.note || ''}
                    onChange={(e) => updateNote(todayStr, e.target.value)}
                    placeholder="How did the day go?"
                    className="w-full h-24 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
            </div>
        </div>
    );
};

const HistoryView = ({ logs, habits, todayStr }) => {
    const sortedDates = Object.keys(logs).sort().reverse();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">History</h2>
            {sortedDates.length === 0 && (
                <p className="text-slate-500">No history available yet.</p>
            )}
            {sortedDates.map(date => {
                if (date === todayStr) return null;

                const dayLog = logs[date];
                const dayCompletedCount = dayLog.completed_habit_ids.length;
                const indicatorColor = dayCompletedCount > 0 ? 'bg-green-500' : 'bg-slate-300';

                return (
                    <div key={date} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${indicatorColor}`}></div>
                                <h3 className="font-bold text-slate-700">{date}</h3>
                            </div>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                {dayCompletedCount} completed
                            </span>
                        </div>

                        {dayLog.note && (
                            <div className="text-sm text-slate-500 italic mb-3 pl-5 border-l-2 border-slate-200">
                                "{dayLog.note}"
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-2">
                            {dayLog.completed_habit_ids.map(hId => {
                                const h = habits.find(ref => ref.id === hId);
                                return h ? (
                                    <span key={hId} className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded-md">
                                        {h.name}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const SettingsView = ({ habits, logs, setHabits, setLogs, todayStr }) => {
    const fileInputRef = useRef(null);

    const exportData = () => {
        const dataStr = JSON.stringify({ habits, logs }, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tracker_backup_${todayStr}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.habits && parsed.logs) {
                    if (window.confirm("This will overwrite your current data. Continue?")) {
                        setHabits(parsed.habits);
                        setLogs(parsed.logs);
                        alert("Data restored successfully!");
                    }
                } else {
                    alert("Invalid file format.");
                }
            } catch (err) {
                alert("Error reading file.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Data Management</h2>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                        <Download className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800">Backup Data</h3>
                        <p className="text-sm text-slate-500 mb-3">
                            Download your entire history as a JSON file.
                        </p>
                        <button
                            onClick={exportData}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
                        >
                            Download Backup
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 rounded-full text-orange-600">
                        <Upload className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800">Restore Data</h3>
                        <p className="text-sm text-slate-500 mb-3">
                            Upload a previously downloaded JSON backup file.
                            <span className="text-red-500 block mt-1">Warning: Overwrites current data!</span>
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".json"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const DailyTracker = () => {

    // Using 'en-CA' forces YYYY-MM-DD format based on LOCAL time
    const getTodayStr = () => new Date().toLocaleDateString('en-CA');

    // Initial state loads correctly
    const [todayStr, setTodayStr] = useState(getTodayStr());

    //Check date every minute, but only re-render if day changed
    useEffect(() => {
        const timer = setInterval(() => {
            const current = getTodayStr();
            if (current !== todayStr) {
                setTodayStr(current); // Only updates state if midnight passed
            }
        }, 60000); // Checks every 60 seconds

        return () => clearInterval(timer);
    }, [todayStr]);


    const [view, setView] = useState('dashboard');
    const [newHabitName, setNewHabitName] = useState('');

    // Load Habits (Lazy Init)
    const [habits, setHabits] = useState(() => {
        try {
            const savedData = localStorage.getItem('routine_tracker_data');
            return savedData ? JSON.parse(savedData).habits || [] : [];
        } catch (e) {
            console.error("Error loading habits:", e);
            return [];
        }
    });

    // Load Logs (Lazy Init)
    const [logs, setLogs] = useState(() => {
        try {
            const savedData = localStorage.getItem('routine_tracker_data');
            return savedData ? JSON.parse(savedData).logs || {} : {};
        } catch (e) {
            console.error("Error loading logs:", e);
            return {};
        }
    });

    // Save Data
    useEffect(() => {
        localStorage.setItem('routine_tracker_data', JSON.stringify({ habits, logs }));
    }, [habits, logs]);

    // Actions
    const addHabit = (e) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;
        const newHabit = {
            id: Date.now().toString(),
            name: newHabitName,
            created_at: new Date().toISOString(),
            is_deleted: false,
        };
        setHabits([...habits, newHabit]);
        setNewHabitName('');
    };

    const deleteHabit = (id) => {
        if (window.confirm('Remove from daily view? (History will be kept)')) {
            setHabits(habits.map(h => h.id === id ? { ...h, is_deleted: true } : h));
        }
    };

    const toggleHabitForDate = (date, habitId) => {
        setLogs(prevLogs => {
            const dayLog = prevLogs[date] || { completed_habit_ids: [], note: '' };
            const isCompleted = dayLog.completed_habit_ids.includes(habitId);
            let newCompletedIds;
            if (isCompleted) {
                newCompletedIds = dayLog.completed_habit_ids.filter(id => id !== habitId);
            } else {
                newCompletedIds = [...dayLog.completed_habit_ids, habitId];
            }
            return {
                ...prevLogs,
                [date]: { ...dayLog, completed_habit_ids: newCompletedIds }
            };
        });
    };

    const updateNote = (date, text) => {
        setLogs(prevLogs => {
            const dayLog = prevLogs[date] || { completed_habit_ids: [], note: '' };
            return {
                ...prevLogs,
                [date]: { ...dayLog, note: text }
            };
        });
    };

    const activeHabits = habits.filter(h => !h.is_deleted);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 md:pb-0">
            <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl md:border-x md:border-slate-200 flex flex-col">

                {/* Top Bar */}
                <div className="p-4 border-b border-slate-100 flex justify-center">
                    <h1 className="text-lg font-bold tracking-tight text-slate-800">Routine Tracker</h1>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {view === 'dashboard' && (
                        <DashboardView
                            todayStr={todayStr}
                            activeHabits={activeHabits}
                            logs={logs}
                            newHabitName={newHabitName}
                            setNewHabitName={setNewHabitName}
                            addHabit={addHabit}
                            toggleHabit={toggleHabitForDate}
                            deleteHabit={deleteHabit}
                            updateNote={updateNote}
                        />
                    )}
                    {view === 'history' && (
                        <HistoryView
                            logs={logs}
                            habits={habits}
                            todayStr={todayStr}
                        />
                    )}
                    {view === 'settings' && (
                        <SettingsView
                            habits={habits}
                            logs={logs}
                            setHabits={setHabits}
                            setLogs={setLogs}
                            todayStr={todayStr}
                        />
                    )}
                </div>

                {/* Bottom Navigation */}
                <div className="border-t border-slate-200 bg-white p-2 grid grid-cols-3 gap-1 sticky bottom-0">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`flex flex-col items-center p-3 rounded-lg transition-colors ${view === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <LayoutDashboard className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Today</span>
                    </button>

                    <button
                        onClick={() => setView('history')}
                        className={`flex flex-col items-center p-3 rounded-lg transition-colors ${view === 'history' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <History className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">History</span>
                    </button>

                    <button
                        onClick={() => setView('settings')}
                        className={`flex flex-col items-center p-3 rounded-lg transition-colors ${view === 'settings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <Settings className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Data</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyTracker;