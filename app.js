// app.js

const trails = [
  ...(trailData.TX || []),
  ...(trailData.OK || []),
  ...(trailData.KA || [])
];

// ───────────────────────────────── TrailDetail (detail "page") ─────────────────────────────────
function TrailDetail(props) {
  const trail = props.trail;
  const onBack = props.onBack;
  const detailMapRef = React.useRef(null);

  const getTrailStateCode = function (t) {
    if ((trailData.TX || []).includes(t)) return "TX";
    if ((trailData.OK || []).includes(t)) return "OK";
    if ((trailData.KA || []).includes(t)) return "KA";
    return null;
  };

  const trailStateCode = getTrailStateCode(trail);
  const relatedTrails = trails
    .filter(function (t) {
      return t !== trail && getTrailStateCode(t) === trailStateCode;
    })
    .slice(0, 4);

  React.useEffect(() => {
    if (!trail) return;
    if (trail.lat === -100 || trail.long === -200) return;

    let view = null;

    require(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer"
      ],
      function (Map, MapView, Graphic, GraphicsLayer) {
        if (!detailMapRef.current) return;

        const map = new Map({ basemap: "topo-vector" });
        view = new MapView({
          container: detailMapRef.current,
          map: map,
          center: [trail.long, trail.lat],
          zoom: 13
        });

        view.when(function () {
          setTimeout(function () {
            if (view) view.resize();
          }, 150);
        });

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        const point = {
          type: "point",
          longitude: trail.long,
          latitude: trail.lat
        };

        const symbol = {
          type: "simple-marker",
          color: [45, 95, 45],
          outline: { color: [255, 255, 255], width: 1 }
        };

        const popupTemplate = {
          title: trail.projectName,
          content: trail.areaName
        };

        const graphic = new Graphic({
          geometry: point,
          symbol: symbol,
          popupTemplate: popupTemplate
        });

        graphicsLayer.add(graphic);
      }
    );

    return function () {
      if (view) {
        view.container = null;
        view.destroy();
        view = null;
      }
      if (detailMapRef.current) {
        detailMapRef.current.innerHTML = "";
      }
    };
  }, [trail]);

  return React.createElement(
    "div",
    {
      className: "trail-detail",
      style: {
        maxWidth: "1120px",
        margin: "0 auto",
        marginTop: "16px",
        marginBottom: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "18px",
        padding: "20px 24px 24px",
        boxShadow: "0 14px 28px rgba(15,23,42,0.12)",
        border: "1px solid #e5e7eb",
        borderTop: "4px solid #2d5f2d"
      }
    },

    React.createElement(
      "button",
      {
        onClick: onBack,
        style: {
          marginBottom: "18px",
          padding: "6px 16px",
          backgroundColor: "#f9fafb",
          border: "1px solid #d1d5db",
          borderRadius: "999px",
          cursor: "pointer",
          fontSize: "0.85rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "#374151"
        }
      },
      "← Back to all trails"
    ),

    React.createElement(
      "div",
      { style: { marginBottom: "10px" } },

      React.createElement(
        "div",
        {
          style: {
            fontSize: "0.8rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#6b7280",
            marginBottom: "2px"
          }
        },
        trail.areaName || "Trail area"
      ),

      React.createElement(
        "h1",
        {
          style: {
            margin: "0",
            fontSize: "1.7rem",
            lineHeight: "1.3",
            color: "#111827",
            fontWeight: 700
          }
        },
        trail.projectName || "Unnamed Trail"
      )
    ),

    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "18px"
        }
      },
      React.createElement(
        "span",
        {
          style: {
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor: "#f0f7ec",
            fontSize: "0.8rem",
            color: "#2d5f2d"
          }
        },
        "Length: ",
        trail.length !== -1 ? trail.length + " mi" : "Unknown"
      ),
      React.createElement(
        "span",
        {
          style: {
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor: "#fef3c7",
            fontSize: "0.8rem",
            color: "#92400e"
          }
        },
        "Elevation: ",
        trail.eGain !== -1 ? trail.eGain + " ft" : "Unknown"
      ),
      React.createElement(
        "span",
        {
          style: {
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor: "#dcfce7",
            fontSize: "0.8rem",
            color: "#166534"
          }
        },
        "Intensity: ",
        trail.intensity || "Unknown"
      )
    ),

    React.createElement("hr", {
      style: {
        border: "none",
        borderTop: "1px solid #e5e7eb",
        margin: "0 0 16px 0"
      }
    }),

    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          flexWrap: "wrap"
        }
      },

      React.createElement(
        "div",
        { style: { flex: "1 1 280px", minWidth: "240px" } },

        React.createElement(
          "h3",
          {
            style: {
              marginTop: "0",
              marginBottom: "6px",
              fontSize: "0.95rem",
              color: "#111827",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "4px"
            }
          },
          "Activities & Access"
        ),
        React.createElement(
          "p",
          { style: { margin: "3px 0", fontSize: "0.85rem", color: "#4b5563" } },
          React.createElement("strong", null, "Tap: "),
          trail.tap !== undefined ? trail.tap : "N/A"
        ),
        React.createElement(
          "p",
          { style: { margin: "3px 0", fontSize: "0.85rem", color: "#4b5563" } },
          React.createElement("strong", null, "Walkable: "),
          trail.isWalking || "Unknown"
        ),
        React.createElement(
          "p",
          { style: { margin: "3px 0", fontSize: "0.85rem", color: "#4b5563" } },
          React.createElement("strong", null, "Biking: "),
          trail.isBiking || "Unknown"
        ),
        React.createElement(
          "p",
          { style: { margin: "3px 0", fontSize: "0.85rem", color: "#4b5563" } },
          React.createElement("strong", null, "Equestrian: "),
          trail.isEquestrian || "Unknown"
        ),
        React.createElement(
          "p",
          { style: { margin: "3px 0", fontSize: "0.85rem", color: "#4b5563" } },
          React.createElement("strong", null, "Wheelchair: "),
          trail.isWheelchair || "Unknown"
        ),
        React.createElement(
          "p",
          { style: { margin: "3px 0", fontSize: "0.85rem", color: "#4b5563" } },
          React.createElement("strong", null, "Pets Allowed: "),
          trail.isPet || "Unknown"
        ),

        React.createElement(
          "h3",
          {
            style: {
              marginTop: "14px",
              marginBottom: "6px",
              fontSize: "0.95rem",
              color: "#111827",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "4px"
            }
          },
          "More Info"
        ),
        trail.infoLink &&
          React.createElement(
            "p",
            {
              style: {
                margin: "3px 0",
                fontSize: "0.85rem",
                color: "#2d5f2d"
              }
            },
            React.createElement(
              "a",
              {
                href: trail.infoLink,
                target: "_blank",
                rel: "noreferrer",
                style: { color: "inherit", textDecoration: "none" }
              },
              "Open trail website ↗"
            )
          ),
        trail.comments &&
          React.createElement(
            "p",
            {
              style: {
                marginTop: "6px",
                fontSize: "0.85rem",
                fontStyle: "italic",
                color: "#4b5563"
              }
            },
            trail.comments
          )
      ),

      React.createElement("div", {
        id: "detail-map",
        ref: detailMapRef,
        style: {
          width: "100%",
          maxWidth: "420px",
          minWidth: "240px",
          height: "260px",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          flexShrink: 0,
          marginLeft: "0",
          boxShadow: "0 2px 6px rgba(15,23,42,0.08)",
          overflow: "hidden"
        }
      })
    ),

    relatedTrails.length > 0 &&
      React.createElement(
        "div",
        {
          style: {
            marginTop: "20px",
            paddingTop: "12px",
            borderTop: "1px solid #e5e7eb"
          }
        },
        React.createElement(
          "h3",
          {
            style: {
              margin: "0 0 8px 0",
              fontSize: "0.9rem",
              color: "#111827"
            }
          },
          "Other trails in this state"
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: "8px"
            }
          },
          relatedTrails.map(function (rt, idx) {
            return React.createElement(
              "span",
              {
                key: idx,
                style: {
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: "#f3f4f6",
                  fontSize: "0.8rem",
                  color: "#374151"
                }
              },
              rt.projectName || "Unnamed Trail"
            );
          })
        )
      ),

    React.createElement(
      "p",
      {
        style: {
          marginTop: "14px",
          fontSize: "0.75rem",
          color: "#9ca3af"
        }
      },
      "Trail listings from project data; basemap and tiles © Esri and contributors."
    )
  );
}

// ───────────────────────────────── TrailDirectory ─────────────────────────────────
function TrailDirectory(props) {
  const [stateFilter, setStateFilter] = React.useState("All");
  const [bikingFilter, setBikingFilter] = React.useState("None");
  const [equestrianFilter, setEquestrianFilter] = React.useState("None");
  const [wheelchairFilter, setWheelchairFilter] = React.useState("None");
  const [petsFilter, setPetsFilter] = React.useState("None");
  const userLoc = props.userLoc;
  const radius = props.radius;
  const useLocationFilter = props.useLocationFilter;
  const [lengthOp, setLengthOp] = React.useState("None");
  const [lengthValue, setLengthValue] = React.useState("");
  const [eGainOp, setEGainOp] = React.useState("None");
  const [eGainValue, setEGainValue] = React.useState("");
  const [intensityFilter, setIntensityFilter] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("name");
  const [visibleCount, setVisibleCount] = React.useState(30);
  const listPanelRef = React.useRef(null);

  const [selectedTrail, setSelectedTrail] = React.useState(props.initialSelectedTrail || null);
  React.useEffect(function () {
    setSelectedTrail(props.initialSelectedTrail || null);
  }, [props.initialSelectedTrail]);

  const [highlightedProject, setHighlightedProject] = React.useState(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  const [draftStateFilter, setDraftStateFilter] = React.useState(stateFilter);
  const [draftBikingFilter, setDraftBikingFilter] = React.useState(bikingFilter);
  const [draftEquestrianFilter, setDraftEquestrianFilter] = React.useState(equestrianFilter);
  const [draftWheelchairFilter, setDraftWheelchairFilter] = React.useState(wheelchairFilter);
  const [draftPetsFilter, setDraftPetsFilter] = React.useState(petsFilter);
  const [draftLengthOp, setDraftLengthOp] = React.useState(lengthOp);
  const [draftLengthValue, setDraftLengthValue] = React.useState(lengthValue);
  const [draftEGainOp, setDraftEGainOp] = React.useState(eGainOp);
  const [draftEGainValue, setDraftEGainValue] = React.useState(eGainValue);
  const [draftIntensityFilter, setDraftIntensityFilter] = React.useState(intensityFilter);

  const openFilters = function () {
    setDraftStateFilter(stateFilter);
    setDraftBikingFilter(bikingFilter);
    setDraftEquestrianFilter(equestrianFilter);
    setDraftWheelchairFilter(wheelchairFilter);
    setDraftPetsFilter(petsFilter);
    setDraftLengthOp(lengthOp);
    setDraftLengthValue(lengthValue);
    setDraftEGainOp(eGainOp);
    setDraftEGainValue(eGainValue);
    setDraftIntensityFilter(intensityFilter);
    setIsFilterModalOpen(true);
  };

  const applyFilters = function () {
    setStateFilter(draftStateFilter);
    setBikingFilter(draftBikingFilter);
    setEquestrianFilter(draftEquestrianFilter);
    setWheelchairFilter(draftWheelchairFilter);
    setPetsFilter(draftPetsFilter);
    setLengthOp(draftLengthOp);
    setLengthValue(draftLengthValue);
    setEGainOp(draftEGainOp);
    setEGainValue(draftEGainValue);
    setIntensityFilter(draftIntensityFilter);
    setIsFilterModalOpen(false);
  };

  const clearFilters = function () {
    const defaultState = "All";
    setStateFilter(defaultState);
    setBikingFilter("None");
    setEquestrianFilter("None");
    setWheelchairFilter("None");
    setPetsFilter("None");
    setLengthOp("None");
    setLengthValue("");
    setEGainOp("None");
    setEGainValue("");
    setIntensityFilter("All");

    setDraftStateFilter(defaultState);
    setDraftBikingFilter("None");
    setDraftEquestrianFilter("None");
    setDraftWheelchairFilter("None");
    setDraftPetsFilter("None");
    setDraftLengthOp("None");
    setDraftLengthValue("");
    setDraftEGainOp("None");
    setDraftEGainValue("");
    setDraftIntensityFilter("All");
  };

  var getZoomForSpread = function (spread) {
    if (spread <= 0) return 15;
    var zoom = Math.log2(820 / spread);
    return Math.max(6.5, Math.min(19, zoom));
  };

  const mapRef = React.useRef(null);
  const graphicsLayerRef = React.useRef(null);
  const mapContainerRef = React.useRef(null);
  const filteredRef = React.useRef([]);

  var zoomToPoints = function (coords) {
    if (!mapRef.current || coords.length === 0) return;

    var lats = coords.map(function (c) { return c.lat; });
    var longs = coords.map(function (c) { return c.long; });

    var minLat = Math.min.apply(null, lats);
    var maxLat = Math.max.apply(null, lats);
    var minLong = Math.min.apply(null, longs);
    var maxLong = Math.max.apply(null, longs);

    var spreadLat = maxLat - minLat;
    var spreadLong = maxLong - minLong;
    var spread = Math.max(spreadLat, spreadLong);

    var centerLat = (minLat + maxLat) / 2;
    var centerLong = (minLong + maxLong) / 2;

    var zoom = getZoomForSpread(spread);

    mapRef.current.goTo(
      { center: [centerLong, centerLat], zoom: zoom },
      { duration: 600, easing: "ease-in-out" }
    );
  };

  const filtered = trails.filter(function (t) {
    let stateMatch = false;

    if (useLocationFilter && userLoc) {
      if (t.lat === -100 || t.long === -200) return false;
      if (distanceMiles(userLoc.lat, userLoc.long, t.lat, t.long) > radius) return false;
    }

    if (stateFilter === "All") stateMatch = true;
    else if (stateFilter === "TX" && (trailData.TX || []).includes(t)) stateMatch = true;
    else if (stateFilter === "OK" && (trailData.OK || []).includes(t)) stateMatch = true;
    else if (stateFilter === "KA" && (trailData.KA || []).includes(t)) stateMatch = true;

    if (!stateMatch) return false;

    const matchYesNo = function (value, filter) {
      if (filter === "None") return true;
      if (!value) return false;
      return value.toLowerCase() === filter.toLowerCase();
    };

    if (!matchYesNo(t.isBiking, bikingFilter)) return false;
    if (!matchYesNo(t.isEquestrian, equestrianFilter)) return false;
    if (!matchYesNo(t.isWheelchair, wheelchairFilter)) return false;
    if (!matchYesNo(t.isPet, petsFilter)) return false;

    const matchNumber = function (value, op, targetRaw) {
      if (op === "None" || targetRaw === "") return true;
      const target = Number(targetRaw);
      if (isNaN(target)) return true;
      if (value === -1 || value === null || value === undefined) return false;

      const v = Number(value);
      if (op === "<") return v < target;
      if (op === ">") return v > target;
      if (op === "=") return v === target;
      return true;
    };

    if (!matchNumber(t.length, lengthOp, lengthValue)) return false;
    if (!matchNumber(t.eGain, eGainOp, eGainValue)) return false;

    if (intensityFilter !== "All") {
      var tIntensity = (t.intensity || "").toLowerCase();
      var fIntensity = intensityFilter.toLowerCase();
      if (fIntensity === "hard") {
        if (tIntensity !== "hard" && tIntensity !== "difficult" && tIntensity !== "strenuous") return false;
      } else {
        if (tIntensity !== fIntensity) return false;
      }
    }

    if (searchQuery.trim() !== "") {
      var q = searchQuery.trim().toLowerCase();
      var nameMatch = (t.projectName || "").toLowerCase().indexOf(q) !== -1;
      var areaMatch = (t.areaName || "").toLowerCase().indexOf(q) !== -1;
      if (!nameMatch && !areaMatch) return false;
    }

    return true;
  });

  const zoomToTrail = function (t) {
    if (!mapRef.current) return;

    const siblings = filtered.filter(function (s) {
      return s.projectName === t.projectName && s.lat !== -100 && s.long !== -200;
    });

    setHighlightedProject(t.projectName);

    if (siblings.length === 0) return;
    zoomToPoints(siblings);
  };

  React.useEffect(function () {
    filteredRef.current = filtered;
  }, [filtered]);

  React.useEffect(function () {
    setVisibleCount(30);
  }, [stateFilter, bikingFilter, equestrianFilter, wheelchairFilter, petsFilter,
      lengthOp, lengthValue, eGainOp, eGainValue, intensityFilter, searchQuery,
      sortBy, highlightedProject]);

  React.useEffect(function () {
    var panel = listPanelRef.current;
    if (!panel) return;
    var onScroll = function () {
      if (panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 200) {
        setVisibleCount(function (prev) { return prev + 20; });
      }
    };
    panel.addEventListener("scroll", onScroll);
    return function () { panel.removeEventListener("scroll", onScroll); };
  }, []);

  React.useEffect(function () {
    var input = document.getElementById("header-search-input");
    if (!input) return;
    var handler = function (e) { setSearchQuery(e.target.value); };
    input.addEventListener("input", handler);
    return function () { input.removeEventListener("input", handler); };
  }, []);

  React.useEffect(function () {
    require(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer"
      ],
      function (Map, MapView, Graphic, GraphicsLayer) {
        const map = new Map({ basemap: "topo-vector" });

        var initCoords = filtered.filter(function (t) {
          return t.lat !== -100 && t.long !== -200;
        });

        var initCenter = [-96, 35.5];
        var initZoom = 6;

        if (initCoords.length > 0) {
          var iLats = initCoords.map(function (c) { return c.lat; });
          var iLongs = initCoords.map(function (c) { return c.long; });
          var iMinLat = Math.min.apply(null, iLats);
          var iMaxLat = Math.max.apply(null, iLats);
          var iMinLong = Math.min.apply(null, iLongs);
          var iMaxLong = Math.max.apply(null, iLongs);
          var iSpread = Math.max(iMaxLat - iMinLat, iMaxLong - iMinLong);
          initCenter = [(iMinLong + iMaxLong) / 2, (iMinLat + iMaxLat) / 2];
          initZoom = getZoomForSpread(iSpread);
        }

        const view = new MapView({
          container: mapContainerRef.current,
          map: map,
          center: initCenter,
          zoom: initZoom
        });

        view.when(function () {
          setTimeout(function () {
            if (view) view.resize();
          }, 150);
        });

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        graphicsLayerRef.current = graphicsLayer;
        mapRef.current = view;

        view.on("click", function (event) {
          view.hitTest(event).then(function (response) {
            var hit = response.results.find(function (r) {
              return r.graphic && r.graphic.layer === graphicsLayer;
            });
            if (hit) {
              var attrs = hit.graphic.attributes || {};
              var name = attrs.projectName || (hit.graphic.popupTemplate && hit.graphic.popupTemplate.title);
              if (!name) return;

              setHighlightedProject(name);

              var coords = filteredRef.current.filter(function (t) {
                return t.projectName === name && t.lat !== -100 && t.long !== -200;
              }).map(function (t) {
                return { lat: t.lat, long: t.long };
              });

              if (coords.length === 0) {
                coords = graphicsLayer.graphics.filter(function (g) {
                  return g.popupTemplate && g.popupTemplate.title === name;
                }).map(function (g) {
                  return { lat: g.geometry.latitude, long: g.geometry.longitude };
                }).toArray();
              }

              var isParkClick = attrs.kind === "cluster" || attrs.kind === "cluster-label";
              if (isParkClick && coords.length > 1) {
                event.stopPropagation();
                if (view.popup) view.popup.close();
              }

              zoomToPoints(coords);
            }
          });
        });

        filtered.forEach(function (t) {
          if (t.lat !== -100 && t.long !== -200) {
            const point = { type: "point", longitude: t.long, latitude: t.lat };
            const symbol = {
              type: "simple-marker",
              color: [45, 95, 45],
              outline: { color: [255, 255, 255], width: 1 }
            };
            const popupTemplate = {
              title: t.projectName,
              content: t.areaName
            };
            const graphic = new Graphic({
              geometry: point,
              symbol: symbol,
              attributes: {
                projectName: t.projectName,
                kind: "trail",
                areaName: t.areaName
              },
              popupTemplate: popupTemplate
            });
            graphicsLayer.add(graphic);
          }
        });
      }
    );
  }, []);

  React.useEffect(function () {
    if (!userLoc) return;
    if (!mapRef.current) return;

    mapRef.current.goTo(
      { center: [userLoc.long, userLoc.lat], zoom: 9 },
      { duration: 600, easing: "ease-in-out" }
    );
  }, [userLoc]);

  React.useEffect(function () {
    if (!mapRef.current) return;

    if (selectedTrail) {
      mapRef.current.container = null;
      return;
    }

    if (mapContainerRef.current) {
      mapRef.current.container = mapContainerRef.current;

      setTimeout(function () {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      }, 200);
    }
  }, [selectedTrail]);

  React.useEffect(function () {
    const handleResize = function () {
      if (mapRef.current) {
        setTimeout(function () {
          if (mapRef.current) {
            mapRef.current.resize();
          }
        }, 150);
      }
    };

    window.addEventListener("resize", handleResize);
    return function () {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(function () {
    if (!graphicsLayerRef.current) return;

    graphicsLayerRef.current.removeAll();

    var markerGroups = {};
    filtered.forEach(function (t) {
      if (t.lat !== -100 && t.long !== -200) {
        if (!markerGroups[t.projectName]) {
          markerGroups[t.projectName] = [];
        }
        markerGroups[t.projectName].push(t);
      }
    });

    require(["esri/Graphic"], function (Graphic) {
      Object.keys(markerGroups).forEach(function (projectName) {
        var group = markerGroups[projectName];
        var count = group.length;
        var isHL = highlightedProject && projectName === highlightedProject;

        if (isHL) {
          group.forEach(function (t) {
            var pt = { type: "point", longitude: t.long, latitude: t.lat };
            var sym = {
              type: "simple-marker",
              color: [22, 101, 52],
              size: "14px",
              outline: { color: [255, 255, 255], width: 2 }
            };
            graphicsLayerRef.current.add(new Graphic({
              geometry: pt,
              symbol: sym,
              attributes: {
                projectName: projectName,
                kind: "trail",
                areaName: t.areaName
              },
              popupTemplate: { title: projectName, content: t.areaName }
            }));
          });
        } else if (count === 1) {
          var point = { type: "point", longitude: group[0].long, latitude: group[0].lat };
          var symbol = {
            type: "simple-marker",
            color: [45, 95, 45],
            size: "10px",
            outline: { color: [255, 255, 255], width: 1 }
          };
          graphicsLayerRef.current.add(new Graphic({
            geometry: point,
            symbol: symbol,
            attributes: {
              projectName: projectName,
              kind: "trail",
              areaName: group[0].areaName
            },
            popupTemplate: { title: projectName, content: group[0].areaName }
          }));
        } else {
          var avgLat = group.reduce(function (s, t) { return s + t.lat; }, 0) / count;
          var avgLong = group.reduce(function (s, t) { return s + t.long; }, 0) / count;
          var latVals = group.map(function (t) { return t.lat; });
          var longVals = group.map(function (t) { return t.long; });
          var minLat = Math.min.apply(null, latVals);
          var maxLat = Math.max.apply(null, latVals);
          var minLong = Math.min.apply(null, longVals);
          var maxLong = Math.max.apply(null, longVals);
          var clusterPt = { type: "point", longitude: avgLong, latitude: avgLat };

          var circleSymbol = {
            type: "simple-marker",
            color: [45, 95, 45],
            size: "26px",
            outline: { color: [255, 255, 255], width: 2 }
          };
          graphicsLayerRef.current.add(new Graphic({
            geometry: clusterPt,
            symbol: circleSymbol,
            attributes: {
              projectName: projectName,
              kind: "cluster",
              trailCount: count,
              minLat: minLat,
              maxLat: maxLat,
              minLong: minLong,
              maxLong: maxLong
            },
            popupTemplate: { title: projectName, content: count + " trails" }
          }));

          var textSymbol = {
            type: "text",
            text: String(count),
            color: [255, 255, 255],
            font: { size: 10, weight: "bold" },
            horizontalAlignment: "center",
            verticalAlignment: "middle",
            yoffset: 0,
            xoffset: 0
          };
          graphicsLayerRef.current.add(new Graphic({
            geometry: clusterPt,
            symbol: textSymbol,
            attributes: {
              projectName: projectName,
              kind: "cluster-label",
              trailCount: count,
              minLat: minLat,
              maxLat: maxLat,
              minLong: minLong,
              maxLong: maxLong
            },
            popupTemplate: { title: projectName, content: count + " trails" }
          }));
        }
      });
    });
  }, [filtered, highlightedProject]);

  if (selectedTrail) {
    return React.createElement(TrailDetail, {
      trail: selectedTrail,
      onBack: function () { setSelectedTrail(null); }
    });
  }

  var badgeClass = function (intensity) {
    if (!intensity) return "badge badge-unknown";
    var lower = intensity.toLowerCase();
    if (lower === "easy") return "badge badge-easy";
    if (lower === "moderate") return "badge badge-moderate";
    if (lower === "hard" || lower === "difficult" || lower === "strenuous") return "badge badge-hard";
    return "badge badge-unknown";
  };

  var displayTrails = filtered.filter(function (t) {
    if (!highlightedProject) return true;
    return t.projectName === highlightedProject;
  });

  var projectGroupMap = {};
  displayTrails.forEach(function (t) {
    if (!projectGroupMap[t.projectName]) {
      projectGroupMap[t.projectName] = { projectName: t.projectName, trails: [] };
    }
    projectGroupMap[t.projectName].trails.push(t);
  });
  var projectGroups = Object.keys(projectGroupMap).map(function (k) { return projectGroupMap[k]; });

  if (highlightedProject) {
    displayTrails = displayTrails.slice().sort(function (a, b) {
      if (sortBy === "name") return (a.areaName || "").localeCompare(b.areaName || "");
      if (sortBy === "length") return (b.length || 0) - (a.length || 0);
      if (sortBy === "elevation") return (b.eGain || 0) - (a.eGain || 0);
      return 0;
    });
  } else {
    projectGroups.sort(function (a, b) {
      if (sortBy === "name") return (a.projectName || "").localeCompare(b.projectName || "");
      if (sortBy === "length") {
        var aMax = Math.max.apply(null, a.trails.map(function (t) { return t.length || 0; }));
        var bMax = Math.max.apply(null, b.trails.map(function (t) { return t.length || 0; }));
        return bMax - aMax;
      }
      if (sortBy === "elevation") {
        var aMax = Math.max.apply(null, a.trails.map(function (t) { return t.eGain || 0; }));
        var bMax = Math.max.apply(null, b.trails.map(function (t) { return t.eGain || 0; }));
        return bMax - aMax;
      }
      return 0;
    });
  }

  var totalTrails = highlightedProject ? displayTrails.length : projectGroups.length;

  var hasAdvancedFilters = bikingFilter !== "None" || equestrianFilter !== "None" ||
    wheelchairFilter !== "None" || petsFilter !== "None" ||
    lengthOp !== "None" || eGainOp !== "None";

  return React.createElement("div", null,

    isFilterModalOpen && React.createElement(
      "div",
      { className: "modal-backdrop" },
      React.createElement(
        "div",
        { className: "modal-panel" },

        React.createElement("h2", null, "Filters"),

        React.createElement("div", { className: "modal-filter-row" },
          React.createElement("label", null, "State"),
          React.createElement("select", {
            value: draftStateFilter,
            onChange: function (e) { setDraftStateFilter(e.target.value); }
          },
            React.createElement("option", null, "All"),
            React.createElement("option", null, "TX"),
            React.createElement("option", null, "OK"),
            React.createElement("option", null, "KA")
          )
        ),

        React.createElement("div", { className: "modal-filter-row" },
          React.createElement("label", null, "Difficulty"),
          React.createElement("select", {
            value: draftIntensityFilter,
            onChange: function (e) { setDraftIntensityFilter(e.target.value); }
          },
            React.createElement("option", { value: "All" }, "All"),
            React.createElement("option", { value: "Easy" }, "Easy"),
            React.createElement("option", { value: "Moderate" }, "Moderate"),
            React.createElement("option", { value: "Hard" }, "Hard")
          )
        ),

        React.createElement("div", { className: "modal-filter-row" },
          React.createElement("label", null, "Biking"),
          React.createElement("select", {
            value: draftBikingFilter,
            onChange: function (e) { setDraftBikingFilter(e.target.value); }
          },
            React.createElement("option", null, "None"),
            React.createElement("option", null, "Yes"),
            React.createElement("option", null, "No")
          )
        ),

        React.createElement("div", { className: "modal-filter-row" },
          React.createElement("label", null, "Equestrian"),
          React.createElement("select", {
            value: draftEquestrianFilter,
            onChange: function (e) { setDraftEquestrianFilter(e.target.value); }
          },
            React.createElement("option", null, "None"),
            React.createElement("option", null, "Yes"),
            React.createElement("option", null, "No")
          )
        ),

        React.createElement("div", { className: "modal-filter-row" },
          React.createElement("label", null, "Wheelchair"),
          React.createElement("select", {
            value: draftWheelchairFilter,
            onChange: function (e) { setDraftWheelchairFilter(e.target.value); }
          },
            React.createElement("option", null, "None"),
            React.createElement("option", null, "Yes"),
            React.createElement("option", null, "No")
          )
        ),

        React.createElement("div", { className: "modal-filter-row" },
          React.createElement("label", null, "Pets allowed"),
          React.createElement("select", {
            value: draftPetsFilter,
            onChange: function (e) { setDraftPetsFilter(e.target.value); }
          },
            React.createElement("option", null, "None"),
            React.createElement("option", null, "Yes"),
            React.createElement("option", null, "No")
          )
        ),

        React.createElement("div", { className: "modal-filter-row" },
          React.createElement("label", null, "Trail length (miles)"),
          React.createElement("div", null,
            React.createElement("select", {
              value: draftLengthOp,
              onChange: function (e) { setDraftLengthOp(e.target.value); }
            },
              React.createElement("option", { value: "None" }, "None"),
              React.createElement("option", { value: "<" }, "Less than"),
              React.createElement("option", { value: ">" }, "Greater than"),
              React.createElement("option", { value: "=" }, "Equal to")
            ),
            React.createElement("input", {
              type: "number",
              value: draftLengthValue,
              onChange: function (e) { setDraftLengthValue(e.target.value); },
              placeholder: "miles",
              min: "0",
              style: { width: "80px", marginLeft: "6px" }
            })
          )
        ),

        React.createElement("div", { className: "modal-filter-row" },
          React.createElement("label", null, "Elevation gain (ft)"),
          React.createElement("div", null,
            React.createElement("select", {
              value: draftEGainOp,
              onChange: function (e) { setDraftEGainOp(e.target.value); }
            },
              React.createElement("option", { value: "None" }, "None"),
              React.createElement("option", { value: "<" }, "Less than"),
              React.createElement("option", { value: ">" }, "Greater than"),
              React.createElement("option", { value: "=" }, "Equal to")
            ),
            React.createElement("input", {
              type: "number",
              value: draftEGainValue,
              onChange: function (e) { setDraftEGainValue(e.target.value); },
              placeholder: "ft",
              min: "0",
              style: { width: "80px", marginLeft: "6px" }
            })
          )
        ),

        React.createElement("div", { className: "modal-actions" },
          React.createElement("button", {
            type: "button",
            className: "danger",
            onClick: clearFilters
          }, "Clear"),
          React.createElement("button", {
            type: "button",
            onClick: function () { setIsFilterModalOpen(false); }
          }, "Cancel"),
          React.createElement("button", {
            type: "button",
            className: "primary",
            onClick: applyFilters
          }, "Apply")
        )
      )
    ),

    React.createElement("div", { className: "app-layout" },

      React.createElement("div", { className: "list-panel", ref: listPanelRef },

        props.onBackToLanding && React.createElement(
          "button",
          {
            style: {
              marginBottom: "10px",
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "#f3f4f6",
              cursor: "pointer",
              fontSize: "0.8rem"
            },
            onClick: props.onBackToLanding
          },
          "← Back to Home"
        ),

        React.createElement("div", { className: "panel-title" }, "Explore trails"),

        React.createElement("div", { className: "filter-chips" },
          React.createElement("select", {
            className: "filter-chip" + (stateFilter !== "All" ? " active" : ""),
            value: stateFilter,
            onChange: function (e) { setStateFilter(e.target.value); }
          },
            React.createElement("option", { value: "All" }, "All States"),
            React.createElement("option", { value: "TX" }, "Texas"),
            React.createElement("option", { value: "OK" }, "Oklahoma"),
            React.createElement("option", { value: "KA" }, "Kansas")
          ),

          React.createElement("select", {
            className: "filter-chip" + (intensityFilter !== "All" ? " active" : ""),
            value: intensityFilter,
            onChange: function (e) { setIntensityFilter(e.target.value); }
          },
            React.createElement("option", { value: "All" }, "Difficulty"),
            React.createElement("option", { value: "Easy" }, "Easy"),
            React.createElement("option", { value: "Moderate" }, "Moderate"),
            React.createElement("option", { value: "Hard" }, "Hard")
          ),

          React.createElement("button", {
            type: "button",
            className: "filter-chip-btn" + (hasAdvancedFilters ? " active" : ""),
            onClick: openFilters
          }, "⚙ All filters")
        ),

        highlightedProject && React.createElement(
          "div",
          { className: "show-all-bar" },
          React.createElement("span", null,
            "Showing: ",
            React.createElement("strong", null, highlightedProject)
          ),
          React.createElement("button", {
            type: "button",
            onClick: function () {
              setHighlightedProject(null);
              var allCoords = filtered.filter(function (t) {
                return t.lat !== -100 && t.long !== -200;
              });
              zoomToPoints(allCoords);
            }
          }, "Show all")
        ),

        React.createElement("div", { className: "trail-meta-row" },
          React.createElement("div", { className: "trail-count" },
            highlightedProject
              ? totalTrails + " trail" + (totalTrails !== 1 ? "s" : "")
              : totalTrails + " park" + (totalTrails !== 1 ? "s" : "")
          ),
          React.createElement("div", { className: "trail-sort" },
            React.createElement("select", {
              value: sortBy,
              onChange: function (e) { setSortBy(e.target.value); }
            },
              React.createElement("option", { value: "name" }, "Name"),
              React.createElement("option", { value: "length" }, "Length"),
              React.createElement("option", { value: "elevation" }, "Elevation")
            )
          )
        ),

        highlightedProject
          ? displayTrails.slice(0, visibleCount).map(function (t, i) {
              var intensityLabel = t.intensity || "Unknown";

              var tags = [];
              if (t.isWalking === "Yes") tags.push({ label: "Walking", yes: true });
              if (t.isBiking === "Yes") tags.push({ label: "Biking", yes: true });
              if (t.isEquestrian === "Yes") tags.push({ label: "Equestrian", yes: true });
              if (t.isWheelchair === "Yes") tags.push({ label: "Wheelchair", yes: true });
              if (t.isPet === "Yes") tags.push({ label: "Pets", yes: true });

              return React.createElement(
                "div",
                {
                  key: i,
                  className: "trail-card highlighted"
                },
                React.createElement("h2", null, t.areaName || t.projectName || "Unnamed Trail"),

                React.createElement("div", { className: "card-stats" },
                  React.createElement("span", { className: badgeClass(t.intensity) }, intensityLabel),
                  React.createElement("span", { className: "stat-sep" }, "·"),
                  React.createElement("span", null, t.length !== -1 ? t.length + " mi" : "-- mi"),
                  React.createElement("span", { className: "stat-sep" }, "·"),
                  React.createElement("span", null, t.eGain !== -1 ? t.eGain + " ft gain" : "-- ft gain")
                ),

                tags.length > 0 && React.createElement("div", { className: "card-tags" },
                  tags.map(function (tag, j) {
                    return React.createElement("span", {
                      key: j,
                      className: "card-tag" + (tag.yes ? " yes" : "")
                    }, tag.label);
                  })
                ),

                React.createElement("div", { className: "card-bottom" },
                  t.infoLink
                    ? React.createElement("a", {
                        href: t.infoLink,
                        target: "_blank",
                        rel: "noreferrer"
                      }, "Trail info")
                    : React.createElement("span", null),
                  React.createElement("button", {
                    className: "view-details-btn",
                    onClick: function (e) {
                      e.stopPropagation();
                      setSelectedTrail(t);
                    }
                  }, "View Details →")
                )
              );
            })
          : projectGroups.slice(0, visibleCount).map(function (group, i) {
              var count = group.trails.length;

              var areas = [];
              group.trails.forEach(function (t) {
                if (t.areaName && areas.indexOf(t.areaName) === -1) areas.push(t.areaName);
              });
              var areaText = areas.slice(0, 2).join(", ") + (areas.length > 2 ? " +" + (areas.length - 2) + " more" : "");

              var difficulties = {};
              group.trails.forEach(function (t) {
                var d = (t.intensity || "Unknown").toLowerCase();
                difficulties[d] = true;
              });
              var diffList = Object.keys(difficulties);

              return React.createElement(
                "div",
                {
                  key: i,
                  className: "trail-card",
                  onClick: function () {
                    setHighlightedProject(group.projectName);
                    zoomToTrail(group.trails[0]);
                  }
                },

                React.createElement("h2", null, group.projectName || "Unnamed"),
                React.createElement("div", { className: "card-area" }, areaText),

                React.createElement("div", { className: "card-stats" },
                  React.createElement("span", {
                    style: {
                      padding: "1px 8px",
                      borderRadius: "999px",
                      backgroundColor: "#f0f7ec",
                      color: "#2d5f2d",
                      fontWeight: 700,
                      fontSize: "0.72rem"
                    }
                  }, count + " trail" + (count !== 1 ? "s" : "")),
                  diffList.map(function (d, j) {
                    return React.createElement("span", {
                      key: j,
                      className: badgeClass(d === "unknown" ? null : d)
                    }, d.charAt(0).toUpperCase() + d.slice(1));
                  })
                ),

                React.createElement("div", { className: "card-bottom" },
                  React.createElement("span", null),
                  React.createElement("button", {
                    className: "view-details-btn",
                    onClick: function (e) {
                      e.stopPropagation();
                      setHighlightedProject(group.projectName);
                      zoomToTrail(group.trails[0]);
                    }
                  }, "View trails →")
                )
              );
            }),

        visibleCount < totalTrails
          ? React.createElement("div", {
              style: { textAlign: "center", padding: "12px", color: "#6b7280", fontSize: "0.8rem" }
            }, "Scroll for more...")
          : totalTrails > 0 && React.createElement("div", {
              style: { textAlign: "center", padding: "12px", color: "#d1d5db", fontSize: "0.75rem" }
            }, "End of list")
      ),

      React.createElement("div", { className: "map-layer" },
        React.createElement("div", {
          id: "map",
          ref: mapContainerRef
        })
      )
    )
  );
}

const RADIUS_OPTIONS = [10, 50, 100, 200, 300, 500, 1000];
const DEFAULT_RADIUS = 100;

const distanceMiles = function (lat1, lon1, lat2, lon2) {
  const toRad = x => (x * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

function LandingPage(props) {
  const mapDivRef = React.useRef(null);
  const viewRef = React.useRef(null);
  const graphicsLayerRef = React.useRef(null);

  React.useEffect(function () {
    if (!mapDivRef.current) return;

    require(
      ["esri/Map", "esri/views/MapView", "esri/layers/GraphicsLayer"],
      function (Map, MapView, GraphicsLayer) {
        const map = new Map({ basemap: "topo-vector" });

        const view = new MapView({
          container: mapDivRef.current,
          map: map,
          center: [-96, 35.5],
          zoom: 6
        });

        const gl = new GraphicsLayer();
        map.add(gl);

        viewRef.current = view;
        graphicsLayerRef.current = gl;
      }
    );

    return function () {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      graphicsLayerRef.current = null;
    };
  }, []);

  React.useEffect(function () {
    if (!props.userLoc) return;
    if (!viewRef.current || !graphicsLayerRef.current) return;

    const user = props.userLoc;
    const radiusMiles = props.radius || 100;
    const nearbyList = Array.isArray(props.nearbyTrails) ? props.nearbyTrails : [];

    require(["esri/Graphic", "esri/geometry/Circle"], function (Graphic, Circle) {
      const gl = graphicsLayerRef.current;
      gl.removeAll();

      const circle = new Circle({
        center: [user.long, user.lat],
        radius: radiusMiles,
        radiusUnit: "miles"
      });

      gl.add(
        new Graphic({
          geometry: circle,
          symbol: {
            type: "simple-fill",
            color: [45, 95, 45, 0.08],
            outline: { color: [45, 95, 45, 0.6], width: 2 }
          }
        })
      );

      gl.add(
        new Graphic({
          geometry: { type: "point", longitude: user.long, latitude: user.lat },
          symbol: {
            type: "simple-marker",
            color: [37, 99, 235],
            size: "12px",
            outline: { color: [255, 255, 255], width: 2 }
          },
          popupTemplate: { title: "You are here", content: "Current location" }
        })
      );

      const groups = {};
      nearbyList.forEach(function (t) {
        if (!groups[t.projectName]) groups[t.projectName] = [];
        groups[t.projectName].push(t);
      });

      Object.keys(groups).forEach(function (name) {
        const arr = groups[name];
        const count = arr.length;
        const avgLat = arr.reduce((s, x) => s + x.lat, 0) / count;
        const avgLong = arr.reduce((s, x) => s + x.long, 0) / count;

        gl.add(
          new Graphic({
            geometry: { type: "point", longitude: avgLong, latitude: avgLat },
            symbol: {
              type: "simple-marker",
              color: [45, 95, 45],
              size: count > 1 ? "18px" : "12px",
              outline: { color: [255, 255, 255], width: 2 }
            },
            popupTemplate: {
              title: name || "Unnamed",
              content: count + " trail" + (count !== 1 ? "s" : "")
            }
          })
        );

        if (count > 1) {
          gl.add(
            new Graphic({
              geometry: { type: "point", longitude: avgLong, latitude: avgLat },
              symbol: {
                type: "text",
                text: String(count),
                color: [255, 255, 255],
                font: { size: 10, weight: "bold" },
                horizontalAlignment: "center",
                verticalAlignment: "middle"
              },
              popupTemplate: {
                title: name || "Unnamed",
                content: count + " trail" + (count !== 1 ? "s" : "")
              }
            })
          );
        }
      });

      viewRef.current.goTo(circle.extent.expand(1.15), { duration: 600 });
    });
  }, [props.userLoc, props.radius, props.nearbyTrails]);

  return React.createElement(
    "div",
    { className: "landing-wrap" },
    React.createElement(
      "div",
      { className: "landing-card" },

      React.createElement("h2", { className: "landing-title" }, "Welcome to USACE Tulsa District Trails"),
      React.createElement(
        "p",
        { className: "landing-sub" },
        "Discover parks and trailheads across Texas, Oklahoma, and Kansas."
      ),

      React.createElement("div", { className: "landing-actions" },
        React.createElement("button",
          { className: "btn-primary", onClick: props.onEnter },
          "Open Trail Directory"
        ),
        React.createElement("button",
          { className: "btn-secondary", onClick: props.onRequestLocation },
          props.userLoc ? "Location enabled ✓" : "Use My Location"
        )
      ),

      React.createElement("h3", null, "Trails near you"),

      React.createElement("div", { style: { marginBottom: "8px" } },
        "Within ",
        React.createElement("select", {
          value: props.radius,
          onChange: function (e) { props.onRadiusChange(Number(e.target.value)); }
        },
          RADIUS_OPTIONS.map(function (r) {
            return React.createElement("option", { key: r, value: r }, r + " miles");
          })
        )
      ),

      React.createElement("div", {
        className: "landing-map",
        ref: mapDivRef,
        role: "region",
        "aria-label": "Map showing nearby trails"
      }),

      React.createElement("div", { className: "nearby-grid" },
        props.nearbyGroups.slice(0, 6).map(function (g, i) {
          return React.createElement(
            "div",
            {
              key: i,
              className: "nearby-item",
              onClick: function () {
                props.onOpenNearbyTrail(g.projectName);
              },
              role: "button",
              tabIndex: 0,
              onKeyDown: function (e) {
                if (e.key === "Enter" || e.key === " ") {
                  props.onOpenNearbyTrail(g.projectName);
                }
              }
            },
            React.createElement("strong", null, g.projectName),
            React.createElement(
              "div",
              null,
              g.count + " trail" + (g.count !== 1 ? "s" : ""),
              " • closest ~", Math.round(g.closestMiles), " mi"
            )
          );
        })
      )
    )
  );
}

function App() {
  const [page, setPage] = React.useState("landing");
  const [userLoc, setUserLoc] = React.useState(null);
  const [radius, setRadius] = React.useState(DEFAULT_RADIUS);
  const [initialSelectedTrail, setInitialSelectedTrail] = React.useState(null);

  const requestLocation = function () {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        setUserLoc({ lat: pos.coords.latitude, long: pos.coords.longitude });
      },
      function () {
        setUserLoc(null);
      }
    );
  };

  var nearby = [];
  var nearbyGroups = [];

  if (userLoc) {
    nearby = trails.filter(function (t) {
      if (t.lat === -100 || t.long === -200) return false;
      return distanceMiles(userLoc.lat, userLoc.long, t.lat, t.long) <= radius;
    });

    var map = {};
    nearby.forEach(function (t) {
      if (!map[t.projectName]) {
        map[t.projectName] = { projectName: t.projectName, count: 0, closestMiles: 1e9 };
      }
      map[t.projectName].count++;
      var d = distanceMiles(userLoc.lat, userLoc.long, t.lat, t.long);
      if (d < map[t.projectName].closestMiles) map[t.projectName].closestMiles = d;
    });

    nearbyGroups = Object.values(map).sort(function (a, b) {
      return a.closestMiles - b.closestMiles;
    });
  }

  const openNearbyTrail = function (projectName) {
    var match = nearby.find(function (t) {
      return t.projectName === projectName;
    });

    if (match) {
      setInitialSelectedTrail(match);
      setPage("directory");
    }
  };

  React.useEffect(function () {
    var box = document.querySelector(".header-search");
    if (!box) return;
    box.style.display = page === "landing" ? "none" : "block";
  }, [page]);

  if (page === "landing") {
    return React.createElement(LandingPage, {
      onEnter: function () {
        setInitialSelectedTrail(null);
        setPage("directory");
      },
      onRequestLocation: requestLocation,
      onOpenNearbyTrail: openNearbyTrail,
      userLoc: userLoc,
      radius: radius,
      onRadiusChange: setRadius,
      nearbyGroups: nearbyGroups,
      nearbyTrails: nearby
    });
  }

  return React.createElement(TrailDirectory, {
    userLoc: userLoc,
    radius: radius,
    useLocationFilter: false,
    initialSelectedTrail: initialSelectedTrail,
    onBackToLanding: function () {
      setInitialSelectedTrail(null);
      setPage("landing");
    }
  });
}

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById("root")
);