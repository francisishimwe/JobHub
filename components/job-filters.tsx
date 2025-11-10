"use client"

import { useJobs } from "@/lib/job-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { experienceLevels, jobTypes } from "@/lib/mock-data"

export function JobFilters() {
  const { filters, setFilters, filteredJobs } = useJobs()

  const handleExperienceToggle = (level: string) => {
    const newLevels = filters.experienceLevels.includes(level)
      ? filters.experienceLevels.filter((l) => l !== level)
      : [...filters.experienceLevels, level]
    setFilters({ experienceLevels: newLevels })
  }

  const handleJobTypeToggle = (type: string) => {
    const newTypes = filters.jobTypes.includes(type)
      ? filters.jobTypes.filter((t) => t !== type)
      : [...filters.jobTypes, type]
    setFilters({ jobTypes: newTypes })
  }

  const handleReset = () => {
    setFilters({
      search: "",
      location: "",
      experienceLevels: [],
      jobTypes: [],
      opportunityTypes: [],
    })
  }

  // Count jobs for each filter option
  const getExperienceCount = (level: string) => {
    return filteredJobs.filter((job) => job.experienceLevel === level).length
  }

  const getJobTypeCount = (type: string) => {
    return filteredJobs.filter((job) => job.jobType === type).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filter</h3>
        <Button
          variant="link"
          size="sm"
          onClick={handleReset}
          className="h-auto p-0 text-primary hover:text-primary/80"
        >
          Reset
        </Button>
      </div>

      {/* Experience Level */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Experience level</Label>
        <div className="space-y-3">
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`exp-${level}`}
                  checked={filters.experienceLevels.includes(level)}
                  onCheckedChange={() => handleExperienceToggle(level)}
                />
                <label
                  htmlFor={`exp-${level}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {level}
                </label>
              </div>
              <span className="text-sm text-muted-foreground">{getExperienceCount(level)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Job type</Label>
        <div className="space-y-3">
          {jobTypes.map((type) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.jobTypes.includes(type)}
                  onCheckedChange={() => handleJobTypeToggle(type)}
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type}
                </label>
              </div>
              <span className="text-sm text-muted-foreground">{getJobTypeCount(type)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
