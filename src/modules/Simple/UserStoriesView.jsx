import React, {
  useState
} from "react";

import {
  useApp
} from "../../context/AppContext";

import {
  api
} from "../../services/api";

import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText
} from "lucide-react";


// =========================================================
// USER STORIES VIEW
// =========================================================

export const UserStoriesView = () => {

  const {
    data,
    setActiveModule,
    hasUploadedData,
    addUserStory
  } = useApp();


  // =======================================================
  // STATE
  // =======================================================

  const [
    storyCount,
    setStoryCount
  ] = useState(5);


  const [
    generating,
    setGenerating
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const [
    generatedStories,
    setGeneratedStories
  ] = useState("");


  // =======================================================
  // GENERATE USER STORIES
  // =======================================================

  const handleGenerateStories =
    async () => {

      setError("");


      // ---------------------------------------------------
      // DATASET CHECK
      // ---------------------------------------------------

      if (!hasUploadedData) {

        setError(
          "Please upload and process a feedback dataset first."
        );

        setActiveModule(
          "upload"
        );

        return;

      }


      // ---------------------------------------------------
      // START GENERATION
      // ---------------------------------------------------

      setGenerating(true);


      try {

        // -------------------------------------------------
        // CLEAR ONLY LOCAL DISPLAY
        //
        // IMPORTANT:
        // Do NOT call clearGeneratedUserStories().
        // That function does not exist in the current
        // AppContext.
        // -------------------------------------------------

        setGeneratedStories("");


        console.log(
          "Starting user story generation..."
        );


        // -------------------------------------------------
        // CALL BACKEND
        // -------------------------------------------------

        const response =
          await api.generateUserStories(
            storyCount
          );


        console.log(
          "User story API response:",
          response
        );


        // -------------------------------------------------
        // VALIDATE RESPONSE
        // -------------------------------------------------

        if (!response) {

          throw new Error(
            "No response received from backend."
          );

        }


        const generated =
          response.user_stories;


        if (
          !generated ||
          !String(
            generated
          ).trim()
        ) {

          throw new Error(
            "Backend returned no generated user stories."
          );

        }


        // -------------------------------------------------
        // DISPLAY GENERATED STORIES
        // -------------------------------------------------

        setGeneratedStories(
          String(
            generated
          )
        );


        // -------------------------------------------------
        // STORE LIGHTWEIGHT METADATA
        // -------------------------------------------------

        if (
          typeof addUserStory ===
          "function"
        ) {

          addUserStory({

            id:
              `generation-${Date.now()}`,

            role:
              "Product Manager",

            feature:
              "AI Generated User Stories",

            title:
              `${storyCount} User Stories Generated`,

            description:
              `Generated ${storyCount} prioritized Agile user stories from the PRD functional requirements.`,

            action:
              "Review generated user stories",

            benefit:
              "Convert PRD functional requirements into actionable Agile development work.",

            status:
              "Generated",

            source:
              "Backend AI",

            generatedAt:
              new Date().toLocaleString()

          });

        }


        console.log(
          "User stories displayed successfully."
        );


      } catch (err) {

        console.error(
          "USER STORY GENERATION ERROR:",
          err
        );


        setError(
          err?.message ||
          "User story generation failed. Please try again."
        );


      } finally {

        setGenerating(
          false
        );

      }

    };


  // =======================================================
  // EMPTY DATASET STATE
  // =======================================================

  if (
    !hasUploadedData
  ) {

    return (

      <div
        className="animate-fade-in"
        style={{
          paddingBottom:
            "40px"
        }}
      >

        <div
          className="module-header"
        >

          <div>

            <h1
              style={{
                fontSize:
                  "1.6rem",
                fontWeight:
                  700
              }}
            >
              Agile User Stories
            </h1>


            <p
              style={{
                color:
                  "var(--text-muted)",
                fontSize:
                  "0.88rem",
                marginTop:
                  "4px"
              }}
            >
              Generate prioritized Agile user
              stories from your processed
              customer feedback.
            </p>

          </div>

        </div>


        <div
          className="glass-panel"
          style={{
            padding:
              "40px",
            textAlign:
              "center"
          }}
        >

          <AlertCircle
            size={40}
            style={{
              marginBottom:
                "12px"
            }}
          />


          <h3>
            No Dataset Available
          </h3>


          <p
            style={{
              color:
                "var(--text-muted)",
              marginTop:
                "8px"
            }}
          >
            Upload and process your customer
            feedback dataset first.
          </p>


          <button
            className="btn btn-primary"
            style={{
              marginTop:
                "20px"
            }}
            onClick={() =>
              setActiveModule(
                "upload"
              )
            }
          >
            Go to Dataset Upload
          </button>

        </div>

      </div>

    );

  }


  // =======================================================
  // MAIN VIEW
  // =======================================================

  return (

    <div
      className="animate-fade-in"
      style={{
        paddingBottom:
          "40px"
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="module-header"
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap:
            "20px",
          flexWrap:
            "wrap"
        }}
      >

        <div>

          <h1
            style={{
              fontSize:
                "1.6rem",
              fontWeight:
                700
            }}
          >
            Agile User Stories
          </h1>


          <p
            style={{
              color:
                "var(--text-muted)",
              fontSize:
                "0.88rem",
              marginTop:
                "4px"
            }}
          >
            Convert PRD functional requirements
            into prioritized Agile user stories.
          </p>

        </div>


        {/* =================================================
            GENERATION CONTROLS
        ================================================= */}

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "10px"
          }}
        >

          <select
            value={
              storyCount
            }
            onChange={
              event =>
                setStoryCount(
                  Number(
                    event.target.value
                  )
                )
            }
            className="input-field"
            disabled={
              generating
            }
            style={{
              width:
                "120px"
            }}
          >

            <option value={3}>
              3 Stories
            </option>

            <option value={5}>
              5 Stories
            </option>

            <option value={10}>
              10 Stories
            </option>

            <option value={15}>
              15 Stories
            </option>

          </select>


          <button
            onClick={
              handleGenerateStories
            }
            disabled={
              generating
            }
            className="btn btn-primary"
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap:
                "8px"
            }}
          >

            {generating ? (

              <Loader2
                size={16}
                className="animate-spin"
              />

            ) : (

              <Sparkles
                size={16}
              />

            )}


            {generating
              ? "Generating..."
              : "Generate User Stories"}

          </button>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          className="glass-panel"
          style={{
            marginTop:
              "20px",
            padding:
              "16px",
            border:
              "1px solid rgba(244,63,94,0.4)",
            background:
              "rgba(244,63,94,0.08)",
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "10px"
          }}
        >

          <AlertCircle
            size={18}
          />


          <span>
            {error}
          </span>

        </div>

      )}


      {/* =================================================
          DATASET STATUS
      ================================================= */}

      <div
        className="glass-panel"
        style={{
          marginTop:
            "20px",
          padding:
            "14px 18px",
          display:
            "flex",
          alignItems:
            "center",
          gap:
            "10px",
          flexWrap:
            "wrap"
        }}
      >

        <CheckCircle2
          size={18}
        />


        <span
          style={{
            fontSize:
              "0.86rem"
          }}
        >
          Dataset processed successfully
        </span>


        <span
          style={{
            color:
              "var(--text-muted)"
          }}
        >
          •
        </span>


        <span
          style={{
            fontSize:
              "0.86rem"
          }}
        >
          {data?.totalFeedbackCount || 0}
          {" "}
          feedback records
        </span>


        <span
          style={{
            color:
              "var(--text-muted)"
          }}
        >
          •
        </span>


        <span
          style={{
            fontSize:
              "0.86rem"
          }}
        >
          Ready for AI story generation
        </span>

      </div>


      {/* =================================================
          GENERATED USER STORIES
      ================================================= */}

      <div
        className="glass-panel"
        style={{
          marginTop:
            "20px",
          padding:
            "24px"
        }}
      >

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "18px"
          }}
        >

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap:
                "10px"
            }}
          >

            <FileText
              size={20}
            />


            <h3
              style={{
                margin:
                  0
              }}
            >
              Generated User Stories
            </h3>

          </div>


          {generatedStories && (

            <span
              className="badge badge-success"
            >
              AI Generated
            </span>

          )}

        </div>


        {/* =================================================
            EMPTY
        ================================================= */}

        {!generatedStories ? (

          <div
            style={{
              padding:
                "50px 20px",
              textAlign:
                "center",
              color:
                "var(--text-muted)"
            }}
          >

            <Sparkles
              size={36}
              style={{
                marginBottom:
                  "12px"
              }}
            />


            <h3
              style={{
                color:
                  "var(--text-main)"
              }}
            >
              No User Stories Generated Yet
            </h3>


            <p
              style={{
                marginTop:
                  "8px"
              }}
            >
              Select the number of stories
              and click{" "}
              <strong>
                Generate User Stories
              </strong>.
            </p>

          </div>

        ) : (

          /* =================================================
             GENERATED CONTENT
          ================================================= */

          <div
            style={{
              background:
                "var(--bg-input)",
              border:
                "1px solid var(--border-color)",
              borderRadius:
                "12px",
              padding:
                "24px",
              whiteSpace:
                "pre-wrap",
              lineHeight:
                1.7,
              fontSize:
                "0.9rem",
              color:
                "var(--text-main)",
              maxHeight:
                "700px",
              overflowY:
                "auto"
            }}
          >

            {generatedStories}

          </div>

        )}

      </div>

    </div>

  );

};


export default UserStoriesView;