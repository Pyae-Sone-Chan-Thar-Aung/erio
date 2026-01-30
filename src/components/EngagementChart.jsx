export default function EngagementChart() {
  return (
    <div className="glass-card rounded-3xl p-6 md:p-7 shadow-glass">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 tracking-tight">Engagement Updates</h3>
      <p className="text-sm text-gray-600 mb-4">
        Live updates from the External Relations and Internationalization Office Facebook page.
      </p>
      <div className="w-full h-[500px] md:h-[520px] overflow-hidden rounded-3xl">
        <iframe
          title="ERIO Facebook Feed"
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fp%2FUIC-External-Relations-and-Internationalization-Office-100071237296359%2F&tabs=timeline&width=500&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true"
          style={{ border: 'none', overflow: 'hidden', width: '100%', height: '100%' }}
          scrolling="no"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        />
      </div>
    </div>
  )
}
