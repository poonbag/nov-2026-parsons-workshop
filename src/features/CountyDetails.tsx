import {
  aggregateVotes,
  candidateVoteTotal,
  candidates,
  margin,
  share,
  statewide2026,
  type County,
} from "../data/elections";
import { votes, percent, marginLabel } from "../utils/formatNumbers";
import { democratic, republican } from "../utils/electionColors";
export default function CountyDetails({ county }: { county: County }) {
  const totals = aggregateVotes(county.ballotLines);
  const total = candidateVoteTotal(county);
  const value = margin(county)!;
  const difference = value - margin(statewide2026)!;
  return (
    <aside className="county-details" aria-label="Selected county details">
      <span className="section-kicker">
        County results <span>2026</span>
      </span>
      <h2>
        {county.name} <span>County</span>
      </h2>
      <span className="status">
        <i /> Unofficial results
      </span>
      <div className="county-margin">
        <small>{value >= 0 ? "Hochul" : "Blakeman"} reported margin</small>
        <strong style={{ color: value >= 0 ? democratic : republican }}>
          {marginLabel(value)}
          <em> pts</em>
        </strong>
        <p>
          {Math.abs(difference).toFixed(1)} points more{" "}
          {difference >= 0 ? "Democratic" : "Republican"} than New York
          statewide.
        </p>
      </div>
      <div className="county-candidates">
        {[
          ["hochul", candidates.hochul.name, democratic],
          ["blakeman", candidates.blakeman.name, republican],
          ["write-in", "Write-ins", "#888888"],
        ].map(([id, name, color]) => (
          <div key={id}>
            <div className="result-row">
              <span>{name}</span>
              <strong>{percent(share(totals[id], total))}</strong>
            </div>
            <div className="small-track">
              <span
                style={{
                  width: `${(totals[id] / total) * 100}%`,
                  background: color,
                }}
              />
            </div>
            <small>{votes(totals[id])} votes</small>
          </div>
        ))}
      </div>
      <div className="reporting-note" aria-label="County reporting status">
        <strong>
          {votes(county.districtsReporting)} of {votes(county.districtsTotal)}{" "}
          districts reporting
        </strong>
        <p>
          District reporting is not the percentage of votes counted. Even full
          district reporting does not mean the result is certified.
        </p>
        {county.name === "Westchester" && (
          <p className="county-warning">
            The source reports votes alongside 0 districts reporting. The BOE
            warns of unscanned emergency ballots here; results are incomplete.
          </p>
        )}
      </div>
      <dl>
        <div>
          <dt>Candidate votes</dt>
          <dd>{votes(total)}</dd>
        </div>
        <div>
          <dt>Blank ballots</dt>
          <dd>{votes(county.blank)}</dd>
        </div>
        <div>
          <dt>Void ballots</dt>
          <dd>{votes(county.void)}</dd>
        </div>
      </dl>
      <p className="fine-print">
        All candidate shares use candidate votes, including write-ins. Blank and
        void ballots are shown separately.
      </p>
    </aside>
  );
}
