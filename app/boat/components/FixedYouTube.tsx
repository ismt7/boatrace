const FixedYouTube = ({
  videoUrl,
  autoPlay,
}: {
  videoUrl: string;
  autoPlay: boolean;
}) => {
  const extractVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v");
    } catch (e) {
      console.log(e);
      console.error("Invalid URL:", url);
      return null;
    }
  };

  const videoId = videoUrl ? extractVideoId(videoUrl) : null;

  if (!videoId) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        height: 0,
      }}
    >
      <iframe
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default FixedYouTube;
