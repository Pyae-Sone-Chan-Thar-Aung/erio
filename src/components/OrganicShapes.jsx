export default function OrganicShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large glowing sphere - top right */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full gradient-pink-radial opacity-40 blur-[80px] animate-pulse"></div>
      
      {/* Medium sphere - bottom left */}
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full gradient-pink-soft opacity-30 blur-[60px]"></div>
      
      {/* Small sphere - center right */}
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full gradient-pink-soft opacity-25 blur-[50px]"></div>
      
      {/* Organic blob shape - top center (animated) */}
      <div 
        className="absolute top-20 left-1/2 w-[450px] h-[450px] gradient-pink-soft opacity-20 blur-[70px] organic-blob"
        style={{
          transform: 'translateX(-50%)',
        }}
      ></div>
      
      {/* Abstract organic shape - bottom right */}
      <div 
        className="absolute bottom-10 right-20 w-[350px] h-[350px] gradient-pink-soft opacity-20 blur-[55px]"
        style={{
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        }}
      ></div>
      
      {/* Additional floating sphere - middle left */}
      <div className="absolute top-1/2 left-10 w-[250px] h-[250px] rounded-full gradient-pink-soft opacity-15 blur-[40px]"></div>
      
      {/* Small accent sphere - top left */}
      <div className="absolute top-32 left-20 w-[200px] h-[200px] rounded-full gradient-pink-soft opacity-18 blur-[35px]"></div>
      
      {/* Sand texture overlay - very subtle */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-beige-100/20"></div>
    </div>
  )
}
