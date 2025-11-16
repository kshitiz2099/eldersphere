// import { useApp } from "@/contexts/AppContext";
// import { BottomNav } from "@/components/BottomNav";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";

// const Settings = () => {
//   const {
//     textSize,
//     setTextSize,
//     calmAnimations,
//     setCalmAnimations,
//     onlineOnly,
//     setOnlineOnly,
//   } = useApp();

//   const textSizeMap = { small: 0, medium: 1, large: 2 };
//   const textSizeValues = ["small", "medium", "large"] as const;

//   return (
//     <div className="min-h-screen pb-24">
//       <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-foreground">Settings</h1>
//         </div>

//         <div className="space-y-6">
//           {/* Text Size */}
//           <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
//             <Label htmlFor="text-size" className="text-xl font-semibold">
//               Text Size
//             </Label>
//             <div className="space-y-4">
//               <Slider
//                 id="text-size"
//                 min={0}
//                 max={2}
//                 step={1}
//                 value={[textSizeMap[textSize]]}
//                 onValueChange={(value) => setTextSize(textSizeValues[value[0]])}
//                 className="py-4"
//               />
//               <div className="flex justify-between text-sm text-muted-foreground px-2">
//                 <span>Small</span>
//                 <span>Medium</span>
//                 <span>Large</span>
//               </div>
//             </div>
//           </div>

//           {/* Animations */}
//           <div className="bg-card rounded-2xl p-6 border border-border">
//             <div className="flex items-center justify-between">
//               <div className="space-y-1">
//                 <Label htmlFor="animations" className="text-xl font-semibold">
//                   Use calm animations
//                 </Label>
//                 <p className="text-base text-muted-foreground">
//                   Gentle breathing and floating effects
//                 </p>
//               </div>
//               <Switch
//                 id="animations"
//                 checked={calmAnimations}
//                 onCheckedChange={setCalmAnimations}
//               />
//             </div>
//           </div>

//           {/* Online Only */}
//           <div className="bg-card rounded-2xl p-6 border border-border">
//             <div className="flex items-center justify-between">
//               <div className="space-y-1">
//                 <Label htmlFor="online-only" className="text-xl font-semibold">
//                   Show only online Circles
//                 </Label>
//                 <p className="text-base text-muted-foreground">
//                   Hide local, in-person groups
//                 </p>
//               </div>
//               <Switch
//                 id="online-only"
//                 checked={onlineOnly}
//                 onCheckedChange={setOnlineOnly}
//               />
//             </div>
//           </div>

//           {/* Privacy */}
//           <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
//             <h2 className="text-xl font-semibold">Privacy</h2>
//             <p className="text-base text-muted-foreground leading-relaxed">
//               Narrio explains why you were matched to each Circle based on your interests 
//               and personality. You always choose what to share in conversations. Your data stays 
//               private and is used only to help you connect with the right communities.
//             </p>
//           </div>

//           {/* About */}
//           <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
//             <h2 className="text-xl font-semibold">About Narrio</h2>
//             <p className="text-base text-muted-foreground leading-relaxed">
//               A gentle space for connection, conversation, and community. Built with care for 
//               older adults seeking meaningful relationships.
//             </p>
//             <p className="text-sm text-muted-foreground">Version 1.0.0</p>
//           </div>
//         </div>
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default Settings;
