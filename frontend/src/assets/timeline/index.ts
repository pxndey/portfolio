/**
 * Optional illustrations for timeline entries.
 * Add `import foo from './foo.svg'` and `timelineArt.foo = foo` when assets land.
 * See temp/SVG-HANDOFF.md for slugs, sizes, and placement.
 */
import markWork from './mark-work.svg'
import markProject from './mark-project.svg'
import markSchool from './mark-school.svg'
import markResearch from './mark-research.svg'
import nyuNeuro from './nyu-neuro.svg'
import j2j from './j2j.svg'
import homelab from './homelab.svg'
import spikeLocalization from './spike-localization.svg'
import nyu from './nyu.svg'
import hitachi from './hitachi.svg'
import svgScaling from './svg-scaling.svg'
import debiasing from './debiasing.svg'
import geoguessr from './geoguessr.svg'
import drs from './drs.svg'
import tiredeg from './tiredeg.svg'
import merfish from './merfish.svg'
import mriSuperres from './mri-superres.svg'
import neuroDecode from './neuro-decode.svg'
import videoAnalytics from './video-analytics.svg'
import nucleiSeg from './nuclei-seg.svg'
import nas from './nas.svg'
import vit from './vit.svg'
import dps from './dps.svg'
import nyuTa from './nyu-ta.svg'

export const timelineArt: Record<string, string> = {}

timelineArt['mark-work'] = markWork
timelineArt['mark-project'] = markProject
timelineArt['mark-school'] = markSchool
timelineArt['mark-research'] = markResearch
timelineArt['nyu-neuro'] = nyuNeuro
timelineArt.j2j = j2j
timelineArt.homelab = homelab
timelineArt['spike-localization'] = spikeLocalization
timelineArt.nyu = nyu
timelineArt.hitachi = hitachi
timelineArt['svg-scaling'] = svgScaling
timelineArt.debiasing = debiasing
timelineArt.geoguessr = geoguessr
timelineArt.drs = drs
timelineArt.tiredeg = tiredeg
timelineArt.merfish = merfish
timelineArt['mri-superres'] = mriSuperres
timelineArt['neuro-decode'] = neuroDecode
timelineArt['video-analytics'] = videoAnalytics
timelineArt['nuclei-seg'] = nucleiSeg
timelineArt.nas = nas
timelineArt.vit = vit
timelineArt.dps = dps
timelineArt['nyu-ta'] = nyuTa

export function getTimelineArt(slug?: string): string | undefined {
  if (!slug) return undefined
  return timelineArt[slug]
}
