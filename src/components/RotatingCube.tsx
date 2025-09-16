export function RotatingCube() {
  return (
    <div className="flex items-center justify-center h-64 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-services-m365/10 to-services-proofpoint/10 rounded-xl"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-services-m365/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-services-proofpoint/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="rotating-cube relative z-10">
        <div className="w-32 h-32 relative transform-gpu perspective-1000">
          {/* Enhanced cube faces with modern gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-primary opacity-90 rounded-2xl transform rotate-x-12 rotate-y-12 shadow-2xl blur-0"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-services-m365 via-services-m365/80 to-services-m365/60 opacity-80 rounded-2xl transform translate-x-3 translate-y-3 rotate-x-24 rotate-y-24 shadow-xl blur-0"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-services-proofpoint via-services-proofpoint/80 to-services-proofpoint/60 opacity-70 rounded-2xl transform translate-x-6 translate-y-6 rotate-x-36 rotate-y-36 shadow-lg blur-0"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-services-duo via-services-duo/80 to-services-duo/60 opacity-60 rounded-2xl transform translate-x-9 translate-y-9 rotate-x-48 rotate-y-48 shadow-md blur-0"></div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-20">
        <div className="text-lg font-bold text-gradient mb-1">
          3D Analytics
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Modern Visualization
        </div>
      </div>
      
      {/* Glowing orb effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/60 rounded-full blur-sm animate-glow"></div>
    </div>
  );
}